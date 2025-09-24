import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, ProductEntity, TransactionEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import { Product, Transaction, User } from "@shared/types";
import { z } from 'zod';
const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  sku: z.string().min(1),
  barcode: z.string().min(1),
  imageUrl: z.string().url().optional(),
});
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // AUTH ROUTES
  app.post('/api/login', async (c) => {
    const { name, password } = await c.req.json<{ name?: string; password?: string }>();
    if (!name || !password) {
      return bad(c, 'Username and password are required.');
    }
    await UserEntity.ensureSeed(c.env);
    const allUsers = await UserEntity.list(c.env);
    const user = allUsers.items.find(u => u.name === name);
    if (!user || user.password !== password) {
      return c.json({ success: false, error: 'Invalid credentials' }, 401);
    }
    const { password: _, ...userWithoutPassword } = user;
    return ok(c, userWithoutPassword);
  });
  // POS ROUTES
  app.get('/api/products', async (c) => {
    await ProductEntity.ensureSeed(c.env);
    const page = await ProductEntity.list(c.env);
    return ok(c, page.items);
  });
  app.post('/api/products', async (c) => {
    const body = await c.req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return bad(c, 'Invalid product data');
    }
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...parsed.data,
    };
    const created = await ProductEntity.create(c.env, newProduct);
    return ok(c, created);
  });
  app.put('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return bad(c, 'Invalid product data');
    }
    const productEntity = new ProductEntity(c.env, id);
    if (!(await productEntity.exists())) {
      return notFound(c, 'Product not found');
    }
    const updatedProduct: Product = { id, ...parsed.data };
    await productEntity.save(updatedProduct);
    return ok(c, updatedProduct);
  });
  app.delete('/api/products/:id', async (c) => {
    const id = c.req.param('id');
    const deleted = await ProductEntity.delete(c.env, id);
    if (!deleted) {
      return notFound(c, 'Product not found');
    }
    return ok(c, { id, deleted: true });
  });
  app.post('/api/transactions', async (c) => {
    const transactionData = (await c.req.json()) as Omit<Transaction, 'id'>;
    if (!transactionData.items || transactionData.items.length === 0) {
      return bad(c, 'Transaction must include at least one item.');
    }
    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      ...transactionData,
    };
    const createdTransaction = await TransactionEntity.create(c.env, newTransaction);
    return ok(c, { id: createdTransaction.id, status: 'success' });
  });
  app.get('/api/transactions', async (c) => {
    const page = await TransactionEntity.list(c.env);
    return ok(c, page.items);
  });
  // DEMO ROUTES (from boilerplate)
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await UserEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    return ok(c, await UserEntity.create(c.env, { id: crypto.randomUUID(), name: name.trim() }));
  });
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const cq = c.req.query('cursor');
    const lq = c.req.query('limit');
    const page = await ChatBoardEntity.list(c.env, cq ?? null, lq ? Math.max(1, (Number(lq) | 0)) : undefined);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}