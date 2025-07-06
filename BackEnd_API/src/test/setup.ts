// src/test/setup.ts - Setup Global Completo y Corregido

import { testConnection } from '../database/mysql/mysqldb';

// ============= VARIABLES DE ENTORNO CORREGIDAS =============
process.env.NODE_ENV = 'test';
process.env.PORT = '3001'; // Puerto diferente al dev
process.env.DB_NAME = 'hamster'; // Nombre correcto de la DB
process.env.JWT_SECRET = 'test_jwt_secret_key_for_automated_testing';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '3306';
process.env.DB_USER = 'didi20'; // Usuario correcto
process.env.DB_PASS = 'margarita20'; // Password correcto

// ============= VARIABLES GLOBALES =============
let globalConnection: any;
let testServer: any;

// ============= CONFIGURACIÓN ANTES DE TODOS LOS TESTS =============
beforeAll(async () => {
  console.log('🚀 [GLOBAL SETUP] Iniciando configuración de tests...');
  
  try {
    // 1. Conectar a base de datos de test
    globalConnection = await testConnection();
    console.log('✅ [GLOBAL SETUP] Conexión a DB de test exitosa');
    
    // 2. Crear tablas de test si no existen (opcional)
    await createTestTablesIfNotExist();
    console.log('✅ [GLOBAL SETUP] Tablas de test verificadas');
    
    // 3. Limpiar datos previos
    await cleanAllTestData();
    console.log('✅ [GLOBAL SETUP] Base de datos limpia');
    
    // 4. Configurar servidor de test (opcional)
    // testServer = await startTestServer();
    
    console.log('🎯 [GLOBAL SETUP] Configuración global completada');
    
  } catch (error) {
    console.error('❌ [GLOBAL SETUP] Error en configuración:', error);
    throw error;
  }
}, 30000); // Timeout de 30 segundos

// ============= LIMPIEZA DESPUÉS DE TODOS LOS TESTS =============
afterAll(async () => {
  console.log('🧹 [GLOBAL CLEANUP] Iniciando limpieza final...');
  
  try {
    // 1. Limpiar todos los datos de test
    if (globalConnection) {
      await cleanAllTestData();
      console.log('✅ [GLOBAL CLEANUP] Datos de test eliminados');
      
      // 2. Cerrar conexión correctamente (usar release en lugar de end)
      try {
        await globalConnection.release(); // Usar release() para conexiones pooled
        console.log('✅ [GLOBAL CLEANUP] Conexión liberada');
      } catch (releaseError) {
        // Si release() falla, intentar end() como fallback
        try {
          await globalConnection.end();
          console.log('✅ [GLOBAL CLEANUP] Conexión cerrada con end()');
        } catch (endError) {
          console.warn('⚠️ [GLOBAL CLEANUP] Error cerrando conexión:', endError);
        }
      }
    }
    
    // 3. Cerrar servidor de test si existe
    if (testServer) {
      await testServer.close();
      console.log('✅ [GLOBAL CLEANUP] Servidor de test cerrado');
    }
    
    console.log('🏁 [GLOBAL CLEANUP] Limpieza global completada');
    
  } catch (error) {
    console.error('❌ [GLOBAL CLEANUP] Error en limpieza:', error);
  }
}, 30000);

// ============= LIMPIEZA ANTES DE CADA TEST =============
beforeEach(async () => {
  // Limpiar datos entre tests individuales con nombres correctos
  if (globalConnection) {
    try {
      await globalConnection.execute('DELETE FROM animals WHERE ownerId LIKE "%test%" OR name LIKE "%test%"');
      await globalConnection.execute('DELETE FROM users WHERE email LIKE "%test%" OR name LIKE "%test%"');
      await globalConnection.execute('DELETE FROM dht11 WHERE temperature < 0 OR temperature > 100'); // Solo datos obviamente de test
    } catch (cleanError) {
      console.warn('⚠️ Error en limpieza beforeEach:', cleanError);
    }
  }
});

// ============= FUNCIONES HELPER GLOBALES =============

// Función para crear tablas de test
async function createTestTablesIfNotExist() {
  if (!globalConnection) return;
  
  try {
    // Verificar si las tablas existen
    const [userTables] = await globalConnection.execute("SHOW TABLES LIKE 'users'");
    if ((userTables as any[]).length === 0) {
      console.log('ℹ️ Creando tabla users para testing...');
      // Las tablas ya existen según tu esquema, solo verificamos
    }
    
    const [animalTables] = await globalConnection.execute("SHOW TABLES LIKE 'animals'");
    if ((animalTables as any[]).length === 0) {
      console.log('ℹ️ Tabla animals no encontrada');
    }
    
    const [dht11Tables] = await globalConnection.execute("SHOW TABLES LIKE 'dht11'");
    if ((dht11Tables as any[]).length === 0) {
      console.log('ℹ️ Tabla dht11 no encontrada');
    }
    
    const [cameraTables] = await globalConnection.execute("SHOW TABLES LIKE 'cameras'");
    if ((cameraTables as any[]).length === 0) {
      console.log('ℹ️ Tabla cameras no encontrada');
    }
    
  } catch (error) {
    console.warn('⚠️ Error verificando tablas:', error);
  }
}

// Función para limpiar todos los datos de test
async function cleanAllTestData() {
  if (!globalConnection) return;
  
  try {
    // Limpiar en orden (respetando foreign keys) con nombres correctos de tabla
    await globalConnection.execute('DELETE FROM animals WHERE ownerId LIKE "%test%" OR name LIKE "%test%"');
    await globalConnection.execute('DELETE FROM users WHERE email LIKE "%test%" OR name LIKE "%test%"');
    
    // Limpiar tabla DHT11 con nombre correcto
    try {
      await globalConnection.execute('DELETE FROM dht11 WHERE id > 0 AND recorded_at < NOW()');
    } catch (dhtError: any) {
      if (dhtError.code !== 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Error limpiando dht11:', dhtError.message);
      }
    }
    
    // Limpiar tabla cameras si es necesario
    try {
      await globalConnection.execute('DELETE FROM cameras WHERE id LIKE "%test%"');
    } catch (cameraError: any) {
      if (cameraError.code !== 'ER_NO_SUCH_TABLE') {
        console.warn('⚠️ Error limpiando cameras:', cameraError.message);
      }
    }
    
    console.log('✅ Datos de test eliminados');
    
  } catch (error) {
    console.warn('⚠️ Error limpiando datos de test:', error);
  }
}

// ============= HELPERS GLOBALES PARA TESTS =============
global.testHelper = {
  // Helper para crear usuarios de test
  createTestUser: (userData = {}) => {
    const defaultUser = {
      name: "TestUser",
      lastname: "TestLastname", 
      email: `test.${Date.now()}.${Math.random().toString(36).substring(7)}@example.com`, // Email único
      password: "TestPassword123!"
    };
    
    return { ...defaultUser, ...userData };
  },
  
  // Helper para crear animales de test
  createTestAnimal: (animalData = {}) => {
    const defaultAnimal = {
      name: `TestPet_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      breed: "TestBreed",
      species: "TestSpecies", 
      age: 3,
      gender: "TestGender",
      color: "TestColor",
      size: "Medium",
      notes: "Test animal for automated testing"
    };
    
    return { ...defaultAnimal, ...animalData };
  },
  
  // Helper para crear datos de sensor DHT11 con nombres correctos
  createTestDHT11Data: (sensorData = {}) => {
    const defaultData = {
      temperature: 25.5,
      humidity: 60.2
      // recorded_at se genera automáticamente en MySQL
    };
    
    return { ...defaultData, ...sensorData };
  },
  
  // Helper para crear datos de cámara
  createTestCameraData: (cameraData = {}) => {
    const defaultCamera = {
      id: `test_camera_${Date.now()}`,
      isCameraOn: false
    };
    
    return { ...defaultCamera, ...cameraData };
  },
  
  // Helper para obtener conexión de test
  getConnection: () => globalConnection,
  
  // Helper para limpiar datos específicos
  cleanUserData: async (email: string) => {
    if (globalConnection) {
      await globalConnection.execute('DELETE FROM users WHERE email = ?', [email]);
    }
  },
  
  cleanAnimalData: async (name: string) => {
    if (globalConnection) {
      await globalConnection.execute('DELETE FROM animals WHERE name = ?', [name]);
    }
  },
  
  // Helper para verificar si una tabla existe
  tableExists: async (tableName: string): Promise<boolean> => {
    if (!globalConnection) return false;
    
    try {
      const [tables] = await globalConnection.execute(`SHOW TABLES LIKE '${tableName}'`);
      return (tables as any[]).length > 0;
    } catch (error) {
      return false;
    }
  },
  
  // Helper para obtener el último ID insertado
  getLastInsertId: async (): Promise<number> => {
    if (!globalConnection) return 0;
    
    try {
      const [result] = await globalConnection.execute('SELECT LAST_INSERT_ID() as id');
      return (result as any[])[0]?.id || 0;
    } catch (error) {
      return 0;
    }
  }
};

// ============= DECLARACIÓN DE TIPOS GLOBALES =============
declare global {
  var testHelper: {
    createTestUser: (userData?: any) => any;
    createTestAnimal: (animalData?: any) => any;
    createTestDHT11Data: (sensorData?: any) => any;
    createTestCameraData: (cameraData?: any) => any;
    getConnection: () => any;
    cleanUserData: (email: string) => Promise<void>;
    cleanAnimalData: (name: string) => Promise<void>;
    tableExists: (tableName: string) => Promise<boolean>;
    getLastInsertId: () => Promise<number>;
  };
}

console.log('📋 [SETUP] Configuración global de testing cargada con esquema de DB correcto');