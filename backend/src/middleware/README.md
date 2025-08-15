# Middleware Documentation

## System Admin Protection Middlewares

This directory contains middleware functions to protect system administrators from unauthorized modifications.

### `protectSystemAdmin`

**Purpose**: Prevents non-system_admin users from updating or deleting system_admin users.

**Usage**: Add this middleware before `updateUser` and `deleteUser` operations.

**Behavior**:
- If current user is `system_admin` → Allow all operations
- If target user is `system_admin` and current user is not `system_admin` → Deny access
- Otherwise → Allow operation to proceed

**Example**:
```typescript
router.put('/:id', 
  authMiddleware, 
  requireAdmin, 
  protectSystemAdmin,  // ← Add this middleware
  updateUser
);
```

### `preventSystemAdminDemotion`

**Purpose**: Prevents system_admin users from being demoted to lower roles.

**Usage**: Add this middleware before `updateUser` operations.

**Behavior**:
- If current user is not `system_admin` → Let `protectSystemAdmin` handle it
- If target user is currently `system_admin` and role is being changed → Deny access
- Otherwise → Allow operation to proceed

**Example**:
```typescript
router.put('/:id', 
  authMiddleware, 
  requireAdmin, 
  protectSystemAdmin,
  preventSystemAdminDemotion,  // ← Add this middleware
  updateUser
);
```

### `preventSystemAdminCreation`

**Purpose**: Prevents non-system_admin users from creating system_admin users.

**Usage**: Add this middleware before `createUser` operations.

**Behavior**:
- If current user is `system_admin` → Allow all operations
- If request body contains `role: 'system_admin'` and current user is not `system_admin` → Deny access
- Otherwise → Allow operation to proceed

**Example**:
```typescript
router.post('/', 
  authMiddleware, 
  requireAdmin, 
  preventSystemAdminCreation,  // ← Add this middleware
  createUser
);
```

## Implementation in Routes

The middlewares are already implemented in the following routes:

### Users Route (`/api/users`)
- **PUT** `/:id` - Update user: `protectSystemAdmin` + `preventSystemAdminDemotion`
- **DELETE** `/:id` - Delete user: `protectSystemAdmin`
- **POST** `/` - Create user: `preventSystemAdminCreation`

## Security Features

1. **Role-based Access Control**: Only system administrators can modify other system administrators
2. **Prevention of Privilege Escalation**: Non-system admins cannot create system admin accounts
3. **Prevention of Privilege Demotion**: System administrators cannot be demoted to lower roles
4. **Comprehensive Protection**: Covers create, update, and delete operations

## Error Messages

- **403 Forbidden**: "Access denied. Only system administrators can modify other system administrators."
- **403 Forbidden**: "Access denied. System administrators cannot be demoted to lower roles."
- **403 Forbidden**: "Access denied. Only system administrators can create other system administrators."

## Dependencies

- Requires `authMiddleware` to be applied first
- Requires `requireAdmin` or appropriate role middleware
- Uses Prisma client for database queries
- Extends Express Request interface with user property
