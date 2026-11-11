# W02 Assignment: Develop the Specification

# Books API Week 02 Specification

## Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Feature 2: Author CRUD Operations

### Goal
Create an authors API that allows clients to create, retrieve, update, and delete authors. Each author must have a custom string ID, a name, and a birth year. The API must maintain the relationship between authors and books and provide complete Swagger documentation.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required, author's full name
- `birthYear`: number, required, author's year of birth

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects.

Example response:

```json
[
  {
    "id": "a1",
    "name": "John Smith",
    "birthYear": 1980
  },
  {
    "id": "a2",
    "name": "Mary Johnson",
    "birthYear": 1990
  }
]
```

Errors:
- `500` if an unexpected server or database error occurs.

#### GET /authors/:id
Purpose: Return one author by their custom ID.

Success:
- Status code: `200`
- Response body: the matching author object.

Example response:

```json
{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1980
}
```

Errors:
- `404` if no author exists with that ID.
- `500` if an unexpected server or database error occurs.

#### POST /authors
Purpose: Create a new author.

Request body:

```json
{
  "id": "a3",
  "name": "David Brown",
  "birthYear": 1975
}
```

Success:
- Status code: `201`
- Response body: the newly created author object.

Errors:
- `400` if a required field is missing.
- `400` if the author ID already exists.
- `400` if the birth year is invalid.
- `500` if an unexpected server or database error occurs.

#### PUT /authors/:id
Purpose: Update an existing author using their custom ID.

Request body:

```json
{
  "name": "David Brown Updated",
  "birthYear": 1976
}
```

Success:
- Status code: `200`
- Response body: the updated author object.

Errors:
- `400` if a required field is missing.
- `400` if the birth year is invalid.
- `404` if no author exists with that ID.
- `500` if an unexpected server or database error occurs.

#### DELETE /authors/:id
Purpose: Delete an existing author.

An author should only be deleted if no books reference that author's ID.

Success:
- Status code: `204`
- Response body: none.

Errors:
- `404` if no author exists with that ID.
- `400` if the author still has books associated with them.
- `500` if an unexpected server or database error occurs.

### Relationship to Books
Each author can have multiple books associated with them.

The `id` field of an author must match the `authorId` field in the corresponding book documents.

The API must prevent deletion of an author who still has associated books to avoid leaving books with invalid author references.

### Swagger Documentation
Swagger must document every author route, including:
- HTTP methods and route paths.
- Required request body fields.
- Example JSON request bodies.
- Successful response status codes and response schemas.
- Possible error status codes and descriptions.

All author routes must be testable from the Swagger UI at `/api-docs`.

### Deployment Expectations
After implementation, all author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

# Specification Evaluation

After reviewing Version 1, the following improvements were identified.

### 1. Bugs and Short-Sighted Decisions
- The original specifications do not clearly explain whether an author ID can be changed during an update.
- The author deletion error should use `409 Conflict` rather than `400 Bad Request` because the author exists but cannot be deleted due to an existing relationship.
- The API should clearly define how duplicate custom IDs are handled.
- The date and birth year formats need clear validation rules.
- The API should prevent books from referencing authors that do not exist.

### 2. Security Considerations
- Validate all incoming request data before saving it to MongoDB.
- Reject empty strings, invalid data types, and malformed values.
- Prevent clients from modifying MongoDB internal `_id` fields.
- Do not allow clients to update fields that are not part of the defined data model.
- Prevent MongoDB query injection by validating inputs and using safe database queries.
- Keep database credentials in environment variables instead of exposing them in source code.

### 3. Efficiency Concerns
- Check whether an author has associated books before deleting the author.
- Use database queries to retrieve only the necessary documents.
- Avoid unnecessary database operations when validating relationships.
- Consider indexes on custom `id` fields to improve lookup performance and prevent duplicate IDs.

### 4. Response and Error Behavior
- Use consistent JSON error responses.
- Clearly distinguish between `400 Bad Request`, `404 Not Found`, `409 Conflict`, and `500 Internal Server Error`.
- Return `201 Created` when creating a resource.
- Return `204 No Content` when successfully deleting a resource.
- Ensure the response body matches the documented Swagger schemas.

---

# Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 Books API to support complete CRUD operations and establish a valid relationship between books and authors. Every route must have complete Swagger documentation and be testable through Swagger UI.

### Data Model
Book documents will be stored in the `books` collection.

Required fields:

| Field | Type | Required | Description |
|---|---|---|---|
| id | String | Yes | Unique custom ID, e.g. b1 |
| authorId | String | Yes | Custom ID of an existing author |
| title | String | Yes | Book title |
| publicationDate | String | Yes | Publication date in YYYY-MM-DD format |

Example:

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "Introduction to Programming",
  "publicationDate": "2026-01-15"
}
```

### Data Validation and Relationship Rules
1. All four fields are required when creating a book.
2. The `id`, `authorId`, and `title` fields must be non-empty strings.
3. `publicationDate` must be a valid date in `YYYY-MM-DD` format.
4. The custom book `id` must be unique.
5. The `authorId` must match an existing author's custom `id`.
6. The MongoDB `_id` field must not be accepted or modified through client requests.
7. The book `id` cannot be changed through the update route.
8. Invalid requests must be rejected before database modification.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- `200 OK`
- Response body: an array of book objects.
- If no books exist, return an empty array `[]`.

Errors:
- `500 Internal Server Error` if an unexpected database or server error occurs.

#### GET /books/:id
Purpose: Retrieve one book using its custom ID.

Success:
- `200 OK`
- Response body: the matching book object.

Errors:
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### POST /books
Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:
- `201 Created`
- Response body: the newly created book object.

Errors:
- `400 Bad Request` if required fields are missing or invalid.
- `400 Bad Request` if the request contains invalid field types or an invalid publication date.
- `409 Conflict` if the custom book ID already exists.
- `400 Bad Request` if the author ID does not reference an existing author.
- `500 Internal Server Error` if an unexpected error occurs.

#### PUT /books/:id
Purpose: Update an existing book using its custom ID.

The request must include all mutable required fields. The ID is taken from the URL and cannot be changed.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:
- `200 OK`
- Response body: the updated book object.

Errors:
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the new author ID does not reference an existing author.
- `404 Not Found` if no book exists with the requested ID.
- `500 Internal Server Error` if an unexpected error occurs.

#### DELETE /books/:id
Purpose: Delete a book using its custom ID.

Success:
- `204 No Content`
- No response body.

Errors:
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

### Swagger Documentation
Swagger must document all five book routes.

Each route must include:
- HTTP method and endpoint.
- Route parameters and request body schemas.
- Required and optional fields.
- Example requests and responses.
- All expected success and error status codes.
- Response schemas and descriptions.

The Swagger UI must allow developers to test every book operation from the browser.

### Deployment Expectations
- All book routes must work locally.
- All book routes must work on the deployed Render application.
- The deployed `/api-docs` page must document and allow testing of all book operations.
- Database connection information must be configured using environment variables.

---

## Feature 2: Author CRUD Operations

### Goal
Create an Authors API that supports complete CRUD operations. Author documents will be stored in MongoDB and will be referenced by books through their custom author IDs.

### Data Model
Author documents will be stored in the `authors` collection.

Required fields:

| Field | Type | Required | Description |
|---|---|---|---|
| id | String | Yes | Unique custom author ID, e.g. a1 |
| name | String | Yes | Author's full name |
| birthYear | Number | Yes | Four-digit year of birth |

Example author:

```json
{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1980
}
```

### Data Validation and Business Rules
1. Every author must have an `id`, `name`, and `birthYear`.
2. The `id` must be a non-empty string and unique in the authors collection.
3. The `name` must be a non-empty string.
4. The `birthYear` must be an integer representing a valid year, not greater than the current year.
5. The custom author `id` must not be changed through the update route.
6. MongoDB `_id` must not be accepted or modified through client requests.
7. Unknown fields must be rejected.
8. An author cannot be deleted while books still reference their custom ID.

### Routes

#### GET /authors
Purpose: Retrieve all authors.

Success:
- `200 OK`
- Response body: an array of author objects.
- Return an empty array `[]` if no authors exist.

Example response:

```json
[
  {
    "id": "a1",
    "name": "John Smith",
    "birthYear": 1980
  },
  {
    "id": "a2",
    "name": "Mary Johnson",
    "birthYear": 1990
  }
]
```

Errors:
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### GET /authors/:id
Purpose: Retrieve one author using their custom ID.

Success:
- `200 OK`
- Response body:

```json
{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1980
}
```

Errors:
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### POST /authors
Purpose: Create a new author.

Request body:

```json
{
  "id": "a3",
  "name": "David Brown",
  "birthYear": 1975
}
```

Success:
- `201 Created`
- Response body: the newly created author object.

Errors:
- `400 Bad Request` if a required field is missing.
- `400 Bad Request` if the name is empty or the birth year is invalid.
- `400 Bad Request` if the request contains unsupported fields or invalid data types.
- `409 Conflict` if the custom author ID already exists.
- `500 Internal Server Error` if an unexpected error occurs.

#### PUT /authors/:id
Purpose: Update an existing author using their custom ID.

The request body must contain all mutable required fields. The author ID is taken from the URL and cannot be changed.

Request body:

```json
{
  "name": "David Brown Updated",
  "birthYear": 1976
}
```

Success:
- `200 OK`
- Response body: the updated author object.

Errors:
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the request contains unsupported fields or invalid data types.
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### DELETE /authors/:id
Purpose: Delete an author using their custom ID.

Before deleting an author, the API must check whether any book documents have an `authorId` matching the author's custom `id`.

If books are associated with the author, the deletion must be rejected. The books must not be automatically deleted or modified.

Success:
- `204 No Content`
- No response body.

Errors:
- `404 Not Found` if the author does not exist.
- `409 Conflict` if one or more books still reference the author.
- `500 Internal Server Error` if an unexpected server or database error occurs.

Example conflict response:

```json
{
  "error": "Cannot delete author because books are still associated with this author."
}
```

### Relationship to Books
The relationship between authors and books is one-to-many.

- One author can have multiple books.
- Every book must reference one existing author through `authorId`.
- The `authorId` value must match the author's custom `id`.
- When a book is created or updated, the API must verify that the referenced author exists.
- When an author is deleted, the API must verify that no books reference that author.
- The API must prevent orphaned book references.

### Error Response Format
All error responses must use a consistent JSON structure.

Example:

```json
{
  "error": "Resource not found."
}
```

The error message should clearly explain the problem without exposing database credentials, internal server information, or sensitive details.

### Swagger Documentation
Swagger must provide complete documentation for all author routes.

Each route must include:
- HTTP method and endpoint.
- Path parameters.
- Request body schemas and examples.
- Required fields and validation rules.
- Successful response codes and examples.
- Error response codes and examples.
- Description of the relationship between authors and books.

The Swagger UI at `/api-docs` must allow developers to test all author operations directly from the browser.

### Deployment Expectations
- All author routes must work locally.
- All author routes must work on the deployed Render application.
- The authors collection must be accessible through the configured MongoDB database.
- The deployed `/api-docs` page must document and allow testing of all author operations.
- Database credentials must be stored securely in environment variables.

---

## Final Implementation Checklist

### Books API
- [ ] Update the book model to include `authorId`.
- [ ] Keep custom book IDs.
- [ ] Implement GET all books.
- [ ] Implement GET book by ID.
- [ ] Implement POST book.
- [ ] Implement PUT book.
- [ ] Implement DELETE book.
- [ ] Validate the author reference when creating or updating books.
- [ ] Add complete Swagger documentation.

### Authors API
- [ ] Create the authors collection.
- [ ] Define the author data model.
- [ ] Keep custom author IDs.
- [ ] Implement GET all authors.
- [ ] Implement GET author by ID.
- [ ] Implement POST author.
- [ ] Implement PUT author.
- [ ] Implement DELETE author.
- [ ] Prevent deletion of authors who still have associated books.
- [ ] Add complete Swagger documentation.

### Testing and Deployment
- [ ] Test all routes locally.
- [ ] Test successful requests and error cases.
- [ ] Verify book-author relationships.
- [ ] Verify duplicate IDs are rejected.
- [ ] Verify invalid data is rejected.
- [ ] Verify authors with books cannot be deleted.
- [ ] Verify all routes in Swagger UI.
- [ ] Deploy the API to Render.
- [ ] Test the deployed API and `/api-docs` page.

**End of Week 02 Specification**# W02 Assignment: Develop the Specification

# Books API Week 02 Specification

## Version 1

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 book API so book documents include a reference to an author and the API supports all CRUD operations for books. Every book route must be documented and testable in Swagger.

### Data Model
Book documents will be stored in the `books` collection.

Required book fields:
- `id`: string, required, custom id such as `b1`
- `authorId`: string, required, references the `id` field of an author document
- `title`: string, required
- `publicationDate`: string, required

Books will continue to use custom string ids instead of MongoDB `_id` values for route parameters.

### Relationship to Authors
Each book will identify its author with an `authorId` field. The value of `authorId` must match the custom `id` value of an existing author document.

When creating or updating a book, the API should reject the request with a `400` status code if the submitted `authorId` does not match an existing author.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- Status code: `200`
- Response body: an array of book objects

Errors:
- `500` if an unexpected server or database error occurs

#### GET /books/:id
Purpose: Return one book by its custom id.

Success:
- Status code: `200`
- Response body: the matching book object

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### POST /books
Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:
- Status code: `201`
- Response body: the newly created book object

Errors:
- `400` if a required field is missing
- `400` if the `id` already exists
- `400` if the `authorId` does not match an existing author
- `500` if an unexpected server or database error occurs

#### PUT /books/:id
Purpose: Update an existing book.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:
- Status code: `200`
- Response body: the updated book object

Errors:
- `400` if a required field is missing
- `400` if the `authorId` does not match an existing author
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

#### DELETE /books/:id
Purpose: Delete an existing book.

Success:
- Status code: `204`
- Response body: none

Errors:
- `404` if no book exists with that id
- `500` if an unexpected server or database error occurs

### Swagger Documentation
Swagger must document every book route.

### Deployment Expectations
After implementation, the book routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every book route from the browser.

---

## Feature 2: Author CRUD Operations

### Goal
Create an authors API that allows clients to create, retrieve, update, and delete authors. Each author must have a custom string ID, a name, and a birth year. The API must maintain the relationship between authors and books and provide complete Swagger documentation.

### Data Model
Author documents will be stored in the `authors` collection.

Required author fields:
- `id`: string, required, custom id such as `a1`
- `name`: string, required, author's full name
- `birthYear`: number, required, author's year of birth

Authors will use custom string IDs instead of MongoDB `_id` values for route parameters.

### Routes

#### GET /authors
Purpose: Return all authors.

Success:
- Status code: `200`
- Response body: an array of author objects.

Example response:

```json
[
  {
    "id": "a1",
    "name": "John Smith",
    "birthYear": 1980
  },
  {
    "id": "a2",
    "name": "Mary Johnson",
    "birthYear": 1990
  }
]
```

Errors:
- `500` if an unexpected server or database error occurs.

#### GET /authors/:id
Purpose: Return one author by their custom ID.

Success:
- Status code: `200`
- Response body: the matching author object.

Example response:

```json
{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1980
}
```

Errors:
- `404` if no author exists with that ID.
- `500` if an unexpected server or database error occurs.

#### POST /authors
Purpose: Create a new author.

Request body:

```json
{
  "id": "a3",
  "name": "David Brown",
  "birthYear": 1975
}
```

Success:
- Status code: `201`
- Response body: the newly created author object.

Errors:
- `400` if a required field is missing.
- `400` if the author ID already exists.
- `400` if the birth year is invalid.
- `500` if an unexpected server or database error occurs.

#### PUT /authors/:id
Purpose: Update an existing author using their custom ID.

Request body:

```json
{
  "name": "David Brown Updated",
  "birthYear": 1976
}
```

Success:
- Status code: `200`
- Response body: the updated author object.

Errors:
- `400` if a required field is missing.
- `400` if the birth year is invalid.
- `404` if no author exists with that ID.
- `500` if an unexpected server or database error occurs.

#### DELETE /authors/:id
Purpose: Delete an existing author.

An author should only be deleted if no books reference that author's ID.

Success:
- Status code: `204`
- Response body: none.

Errors:
- `404` if no author exists with that ID.
- `400` if the author still has books associated with them.
- `500` if an unexpected server or database error occurs.

### Relationship to Books
Each author can have multiple books associated with them.

The `id` field of an author must match the `authorId` field in the corresponding book documents.

The API must prevent deletion of an author who still has associated books to avoid leaving books with invalid author references.

### Swagger Documentation
Swagger must document every author route, including:
- HTTP methods and route paths.
- Required request body fields.
- Example JSON request bodies.
- Successful response status codes and response schemas.
- Possible error status codes and descriptions.

All author routes must be testable from the Swagger UI at `/api-docs`.

### Deployment Expectations
After implementation, all author routes must work locally and from the deployed Render application. The deployed Swagger page at `/api-docs` must allow someone to test every author route from the browser.

---

# Specification Evaluation

After reviewing Version 1, the following improvements were identified.

### 1. Bugs and Short-Sighted Decisions
- The original specifications do not clearly explain whether an author ID can be changed during an update.
- The author deletion error should use `409 Conflict` rather than `400 Bad Request` because the author exists but cannot be deleted due to an existing relationship.
- The API should clearly define how duplicate custom IDs are handled.
- The date and birth year formats need clear validation rules.
- The API should prevent books from referencing authors that do not exist.

### 2. Security Considerations
- Validate all incoming request data before saving it to MongoDB.
- Reject empty strings, invalid data types, and malformed values.
- Prevent clients from modifying MongoDB internal `_id` fields.
- Do not allow clients to update fields that are not part of the defined data model.
- Prevent MongoDB query injection by validating inputs and using safe database queries.
- Keep database credentials in environment variables instead of exposing them in source code.

### 3. Efficiency Concerns
- Check whether an author has associated books before deleting the author.
- Use database queries to retrieve only the necessary documents.
- Avoid unnecessary database operations when validating relationships.
- Consider indexes on custom `id` fields to improve lookup performance and prevent duplicate IDs.

### 4. Response and Error Behavior
- Use consistent JSON error responses.
- Clearly distinguish between `400 Bad Request`, `404 Not Found`, `409 Conflict`, and `500 Internal Server Error`.
- Return `201 Created` when creating a resource.
- Return `204 No Content` when successfully deleting a resource.
- Ensure the response body matches the documented Swagger schemas.

---

# Version 2

## Feature 1: Book CRUD Operations and Author References

### Goal
Update the existing Week 01 Books API to support complete CRUD operations and establish a valid relationship between books and authors. Every route must have complete Swagger documentation and be testable through Swagger UI.

### Data Model
Book documents will be stored in the `books` collection.

Required fields:

| Field | Type | Required | Description |
|---|---|---|---|
| id | String | Yes | Unique custom ID, e.g. b1 |
| authorId | String | Yes | Custom ID of an existing author |
| title | String | Yes | Book title |
| publicationDate | String | Yes | Publication date in YYYY-MM-DD format |

Example:

```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "Introduction to Programming",
  "publicationDate": "2026-01-15"
}
```

### Data Validation and Relationship Rules
1. All four fields are required when creating a book.
2. The `id`, `authorId`, and `title` fields must be non-empty strings.
3. `publicationDate` must be a valid date in `YYYY-MM-DD` format.
4. The custom book `id` must be unique.
5. The `authorId` must match an existing author's custom `id`.
6. The MongoDB `_id` field must not be accepted or modified through client requests.
7. The book `id` cannot be changed through the update route.
8. Invalid requests must be rejected before database modification.

### Routes

#### GET /books
Purpose: Return all books.

Success:
- `200 OK`
- Response body: an array of book objects.
- If no books exist, return an empty array `[]`.

Errors:
- `500 Internal Server Error` if an unexpected database or server error occurs.

#### GET /books/:id
Purpose: Retrieve one book using its custom ID.

Success:
- `200 OK`
- Response body: the matching book object.

Errors:
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### POST /books
Purpose: Create a new book.

Request body:

```json
{
  "id": "b4",
  "authorId": "a1",
  "title": "Example Book Title",
  "publicationDate": "2026-01-15"
}
```

Success:
- `201 Created`
- Response body: the newly created book object.

Errors:
- `400 Bad Request` if required fields are missing or invalid.
- `400 Bad Request` if the request contains invalid field types or an invalid publication date.
- `409 Conflict` if the custom book ID already exists.
- `400 Bad Request` if the author ID does not reference an existing author.
- `500 Internal Server Error` if an unexpected error occurs.

#### PUT /books/:id
Purpose: Update an existing book using its custom ID.

The request must include all mutable required fields. The ID is taken from the URL and cannot be changed.

Request body:

```json
{
  "authorId": "a2",
  "title": "Updated Book Title",
  "publicationDate": "2026-02-20"
}
```

Success:
- `200 OK`
- Response body: the updated book object.

Errors:
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the new author ID does not reference an existing author.
- `404 Not Found` if no book exists with the requested ID.
- `500 Internal Server Error` if an unexpected error occurs.

#### DELETE /books/:id
Purpose: Delete a book using its custom ID.

Success:
- `204 No Content`
- No response body.

Errors:
- `404 Not Found` if the book does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

### Swagger Documentation
Swagger must document all five book routes.

Each route must include:
- HTTP method and endpoint.
- Route parameters and request body schemas.
- Required and optional fields.
- Example requests and responses.
- All expected success and error status codes.
- Response schemas and descriptions.

The Swagger UI must allow developers to test every book operation from the browser.

### Deployment Expectations
- All book routes must work locally.
- All book routes must work on the deployed Render application.
- The deployed `/api-docs` page must document and allow testing of all book operations.
- Database connection information must be configured using environment variables.

---

## Feature 2: Author CRUD Operations

### Goal
Create an Authors API that supports complete CRUD operations. Author documents will be stored in MongoDB and will be referenced by books through their custom author IDs.

### Data Model
Author documents will be stored in the `authors` collection.

Required fields:

| Field | Type | Required | Description |
|---|---|---|---|
| id | String | Yes | Unique custom author ID, e.g. a1 |
| name | String | Yes | Author's full name |
| birthYear | Number | Yes | Four-digit year of birth |

Example author:

```json
{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1980
}
```

### Data Validation and Business Rules
1. Every author must have an `id`, `name`, and `birthYear`.
2. The `id` must be a non-empty string and unique in the authors collection.
3. The `name` must be a non-empty string.
4. The `birthYear` must be an integer representing a valid year, not greater than the current year.
5. The custom author `id` must not be changed through the update route.
6. MongoDB `_id` must not be accepted or modified through client requests.
7. Unknown fields must be rejected.
8. An author cannot be deleted while books still reference their custom ID.

### Routes

#### GET /authors
Purpose: Retrieve all authors.

Success:
- `200 OK`
- Response body: an array of author objects.
- Return an empty array `[]` if no authors exist.

Example response:

```json
[
  {
    "id": "a1",
    "name": "John Smith",
    "birthYear": 1980
  },
  {
    "id": "a2",
    "name": "Mary Johnson",
    "birthYear": 1990
  }
]
```

Errors:
- `500 Internal Server Error` if an unexpected server or database error occurs.

#### GET /authors/:id
Purpose: Retrieve one author using their custom ID.

Success:
- `200 OK`
- Response body:

```json
{
  "id": "a1",
  "name": "John Smith",
  "birthYear": 1980
}
```

Errors:
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### POST /authors
Purpose: Create a new author.

Request body:

```json
{
  "id": "a3",
  "name": "David Brown",
  "birthYear": 1975
}
```

Success:
- `201 Created`
- Response body: the newly created author object.

Errors:
- `400 Bad Request` if a required field is missing.
- `400 Bad Request` if the name is empty or the birth year is invalid.
- `400 Bad Request` if the request contains unsupported fields or invalid data types.
- `409 Conflict` if the custom author ID already exists.
- `500 Internal Server Error` if an unexpected error occurs.

#### PUT /authors/:id
Purpose: Update an existing author using their custom ID.

The request body must contain all mutable required fields. The author ID is taken from the URL and cannot be changed.

Request body:

```json
{
  "name": "David Brown Updated",
  "birthYear": 1976
}
```

Success:
- `200 OK`
- Response body: the updated author object.

Errors:
- `400 Bad Request` if a required field is missing or invalid.
- `400 Bad Request` if the request contains unsupported fields or invalid data types.
- `404 Not Found` if the author does not exist.
- `500 Internal Server Error` if an unexpected error occurs.

#### DELETE /authors/:id
Purpose: Delete an author using their custom ID.

Before deleting an author, the API must check whether any book documents have an `authorId` matching the author's custom `id`.

If books are associated with the author, the deletion must be rejected. The books must not be automatically deleted or modified.

Success:
- `204 No Content`
- No response body.

Errors:
- `404 Not Found` if the author does not exist.
- `409 Conflict` if one or more books still reference the author.
- `500 Internal Server Error` if an unexpected server or database error occurs.

Example conflict response:

```json
{
  "error": "Cannot delete author because books are still associated with this author."
}
```

### Relationship to Books
The relationship between authors and books is one-to-many.

- One author can have multiple books.
- Every book must reference one existing author through `authorId`.
- The `authorId` value must match the author's custom `id`.
- When a book is created or updated, the API must verify that the referenced author exists.
- When an author is deleted, the API must verify that no books reference that author.
- The API must prevent orphaned book references.

### Error Response Format
All error responses must use a consistent JSON structure.

Example:

```json
{
  "error": "Resource not found."
}
```

The error message should clearly explain the problem without exposing database credentials, internal server information, or sensitive details.

### Swagger Documentation
Swagger must provide complete documentation for all author routes.

Each route must include:
- HTTP method and endpoint.
- Path parameters.
- Request body schemas and examples.
- Required fields and validation rules.
- Successful response codes and examples.
- Error response codes and examples.
- Description of the relationship between authors and books.

The Swagger UI at `/api-docs` must allow developers to test all author operations directly from the browser.

### Deployment Expectations
- All author routes must work locally.
- All author routes must work on the deployed Render application.
- The authors collection must be accessible through the configured MongoDB database.
- The deployed `/api-docs` page must document and allow testing of all author operations.
- Database credentials must be stored securely in environment variables.

---

## Final Implementation Checklist

### Books API
- [ ] Update the book model to include `authorId`.
- [ ] Keep custom book IDs.
- [ ] Implement GET all books.
- [ ] Implement GET book by ID.
- [ ] Implement POST book.
- [ ] Implement PUT book.
- [ ] Implement DELETE book.
- [ ] Validate the author reference when creating or updating books.
- [ ] Add complete Swagger documentation.

### Authors API
- [ ] Create the authors collection.
- [ ] Define the author data model.
- [ ] Keep custom author IDs.
- [ ] Implement GET all authors.
- [ ] Implement GET author by ID.
- [ ] Implement POST author.
- [ ] Implement PUT author.
- [ ] Implement DELETE author.
- [ ] Prevent deletion of authors who still have associated books.
- [ ] Add complete Swagger documentation.

### Testing and Deployment
- [ ] Test all routes locally.
- [ ] Test successful requests and error cases.
- [ ] Verify book-author relationships.
- [ ] Verify duplicate IDs are rejected.
- [ ] Verify invalid data is rejected.
- [ ] Verify authors with books cannot be deleted.
- [ ] Verify all routes in Swagger UI.
- [ ] Deploy the API to Render.
- [ ] Test the deployed API and `/api-docs` page.

**End of Week 02 Specification**