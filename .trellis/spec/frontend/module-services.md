# Module Service Guidelines

## Purpose

Module services keep backend integration simple. Users should be able to replace mock data with their own API calls by editing one small service file per module.

## Pattern

Each module should define:

```text
<module>.types.ts
<module>.mock.ts
<module>.service.ts
<module>.queries.ts
```

Example:

```ts
export type UsersService = {
  list(params: UserListParams): Promise<UserListResult>
  get(id: string): Promise<User>
  update(id: string, input: UpdateUserInput): Promise<User>
}
```

`users.service.ts` may call mock helpers by default. Users can replace those calls with their own API calls.

## Rules

- Keep module service types small and specific to the module.
- Do not force every module into a generic CRUD interface.
- Do not require universal filter operator types.
- Use page pagination for ordinary CRUD modules.
- Use cursor pagination only for stream-like modules such as logs/events/jobs.
- Keep comments clear: "To connect your backend, edit this service."

## Mock Data

- Keep mock datasets small and realistic.
- Include enough rows to show table, empty/loading/error, and detail states.
- Do not make mock data feel like a production backend.

