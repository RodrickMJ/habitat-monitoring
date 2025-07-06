module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  
  roots: ['<rootDir>/src'],
  
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/*.test.ts',
    '**/*.spec.ts'
  ],
  
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/database/**/*.ts',
    '!src/**/index.ts',
    '!src/test/**/*.ts'
  ],
  
  // Configuración de cobertura
  coverageDirectory: 'coverage',
  coverageReporters: [
    'text',
    'lcov', 
    'html',
    'json'
  ],
  
  // Umbrales de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // ✅ AJUSTE: Setup global (se ejecuta UNA VEZ antes de todos los tests)
  setupFilesAfterEnv: [
    '<rootDir>/src/test/setup.ts'
  ],
  
  // Timeout para tests (30 segundos para DB operations)
  testTimeout: 30000,
  
  // Verbose output
  verbose: true,
  
  // Limpiar mocks entre tests
  clearMocks: true,
  
  // ✅ CAMBIO: No necesitas env.setup.ts separado
  // Las variables de entorno ya están en setup.ts
  // setupFiles: ['<rootDir>/src/test/env.setup.ts'],
  
  // ✅ AGREGADO: Configuración para testing de DB
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  
  // ✅ AGREGADO: Ejecutar tests en serie para evitar conflictos de DB
  maxWorkers: 1, // Para evitar conflictos en DB durante tests
  
  // ✅ AGREGADO: Detectar handles abiertos
  detectOpenHandles: true,
  
  // ✅ AGREGADO: Forzar salida después de tests
  forceExit: true,
  
  // ✅ AGREGADO: Patrones de archivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/'
  ]
};