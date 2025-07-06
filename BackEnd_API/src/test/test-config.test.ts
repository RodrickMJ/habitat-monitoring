describe('🔧 Configuration Test', () => {
  it('should have global test helper available', () => {
    expect(global.testHelper).toBeDefined();
    expect(global.testHelper.createTestUser).toBeDefined();
  });
  
  it('should have test environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBeDefined();
  });
});