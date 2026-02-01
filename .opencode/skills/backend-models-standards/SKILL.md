# Backend Models & Standards Skill

## Description
Standards and best practices for backend model implementation and API design.

## When to Use
- Designing backend APIs
- Implementing data models
- Setting up database schemas
- Creating business logic layers

## Core Principles

### 1. Model Design
- **Single Responsibility**: Each model handles one domain concept
- **Validation**: Validate at boundaries, not internally
- **Immutability**: Prefer immutable data structures
- **Consistency**: Use consistent naming and patterns

### 2. API Standards
- **RESTful Design**: Use proper HTTP methods and status codes
- **Versioning**: API versioning strategy (URL or header-based)
- **Documentation**: Auto-generate OpenAPI/Swagger specs
- **Error Handling**: Consistent error format with codes and messages

### 3. Database Standards
- **Migrations**: Version-controlled schema changes
- **Indexing**: Strategic indexes for query performance
- **Relationships**: Clear foreign key constraints
- **Soft Deletes**: Preserve data integrity with deleted_at timestamps

### 4. Security
- **Input Validation**: Sanitize all inputs
- **Authentication**: Verify identity
- **Authorization**: Check permissions
- **Encryption**: Encrypt sensitive data at rest and in transit

## Best Practices

### Model Structure
```typescript
// Entity/Model
class User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Business logic methods
  validate(): boolean;
  toDTO(): UserDTO;
}

// DTO for API
interface UserDTO {
  id: string;
  email: string;
  name: string;
}

// Repository Pattern
interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}
```

### API Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Must be valid email format" }
    ]
  }
}
```

## Validation Rules
- Always validate input at API boundary
- Use schema validation libraries (Zod, Joi, class-validator)
- Return specific validation errors
- Never trust client input

## Testing Requirements
- Unit tests for models and business logic
- Integration tests for API endpoints
- Test database with fixtures
- Mock external services
