# Testing Guide

This directory contains automated tests for the Varam Strength booking system.

## Test Structure

```
tests/
├── setup.js                    # Jest configuration and mocks
├── api/
│   └── book-session.test.js    # API endpoint tests
├── components/
│   └── BookSession.test.jsx    # React component tests
├── stores/
│   └── bookingStore.test.js    # Business logic tests
└── README.md                   # This file
```

## Running Tests

### All Tests

```bash
npm test
```

### Watch Mode (for development)

```bash
npm run test:watch
```

### Coverage Report

```bash
npm run test:coverage
```

## Test Categories

### 1. API Tests (`tests/api/`)

Tests for API endpoints that handle booking requests:

- ✅ Valid booking creation
- ❌ Missing required fields
- ❌ Duplicate booking prevention
- ❌ Database errors
- ❌ Email sending failures

### 2. Component Tests (`tests/components/`)

Tests for React components:

- ✅ Component rendering for different user roles
- ✅ Form field validation
- ✅ Date/time selection logic
- ✅ Duplicate booking detection
- ❌ Error handling

### 3. Store Tests (`tests/stores/`)

Tests for business logic:

- ✅ Data validation
- ✅ Database operations
- ✅ Error handling
- ✅ Input sanitization

## Test Coverage

### What's Tested

- ✅ API endpoint validation and error handling
- ✅ React component rendering and user interactions
- ✅ Business logic for booking creation
- ✅ Form validation and data sanitization
- ✅ Error scenarios and edge cases

### What's Not Tested (Yet)

- ❌ Email sending functionality (mocked)
- ❌ Database integration (mocked)
- ❌ Authentication flows
- ❌ Real-time updates
- ❌ Performance testing

## Adding New Tests

### For API Endpoints

1. Create test file in `tests/api/`
2. Mock external dependencies (database, email)
3. Test success and failure scenarios
4. Verify response status and headers

### For Components

1. Create test file in `tests/components/`
2. Mock stores and external services
3. Test user interactions
4. Verify component state changes

### For Business Logic

1. Create test file in `tests/stores/`
2. Mock database operations
3. Test validation and error handling
4. Verify data transformations

## Mock Strategy

### External Services

- **Supabase**: Mocked to return controlled test data
- **Nodemailer**: Mocked to avoid sending real emails
- **Environment Variables**: Set to test values

### React Dependencies

- **Nanostores**: Mocked to provide test state
- **DatePicker**: Tested indirectly through form interactions

## Best Practices

1. **Isolation**: Each test should be independent
2. **Mocking**: Mock external dependencies consistently
3. **Coverage**: Aim for >80% code coverage
4. **Naming**: Use descriptive test names
5. **Structure**: Follow AAA pattern (Arrange, Act, Assert)

## Troubleshooting

### Common Issues

1. **Import errors**: Check path aliases in Jest config
2. **Mock failures**: Ensure mocks are set up in `setup.js`
3. **Async tests**: Use `waitFor` for component updates
4. **Environment**: Ensure test environment variables are set

### Debug Mode

```bash
npm test -- --verbose
```

## Future Improvements

1. **Integration Tests**: Test real database operations
2. **E2E Tests**: Test complete user workflows
3. **Performance Tests**: Test booking system under load
4. **Accessibility Tests**: Ensure WCAG compliance
5. **Visual Regression Tests**: Test UI consistency
