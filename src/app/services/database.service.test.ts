// database.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { DatabaseService } from './database.service';
import { SQLiteService } from './sqlite.service';
import { User } from '../model/user';
import { NivelEducacional } from '../model/nivel-educacional';
import { BehaviorSubject } from 'rxjs';
import { SQLiteDBConnection, capSQLiteChanges } from '@capacitor-community/sqlite';

// Mocks para funciones utilitarias
const showAlertError = jasmine.createSpy('showAlertError');
const convertDateToString = (date: Date) => date.toISOString();
const convertStringToDate = (str: string) => new Date(str);

// Mock para NivelEducacional
class MockNivelEducacional {
  static getNivelEducacionalById(id: number): NivelEducacional | undefined {
    const nivel = new NivelEducacional();
    nivel.id = id;
    nivel.nombre = `Nivel ${id}`;
    return nivel;
  }
}

// Mock para SQLiteService
class MockSQLiteService {
  createDataBase = jasmine.createSpy('createDataBase').and.returnValue(Promise.resolve());
  open = jasmine.createSpy('open').and.returnValue(Promise.resolve({
    run: jasmine.createSpy('run').and.returnValue(Promise.resolve({ changes: { changes: 1 } })),
    query: jasmine.createSpy('query').and.returnValue(Promise.resolve({ values: [] })),
  } as unknown as SQLiteDBConnection));
}

describe('DatabaseService', () => {
  let service: DatabaseService;
  let sqliteService: MockSQLiteService;
  let mockDb: SQLiteDBConnection;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatabaseService,
        { provide: SQLiteService, useClass: MockSQLiteService }
      ]
    });
    service = TestBed.inject(DatabaseService);
    sqliteService = TestBed.inject(SQLiteService) as unknown as MockSQLiteService;
    mockDb = {
      run: jasmine.createSpy('run').and.returnValue(Promise.resolve({ changes: { changes: 1 } })),
      query: jasmine.createSpy('query').and.returnValue(Promise.resolve({ values: [] })),
    } as unknown as SQLiteDBConnection;

    // Reemplazar funciones utilitarias
    (service as any).showAlertError = showAlertError;
    (service as any).convertDateToString = convertDateToString;
    (service as any).convertStringToDate = convertStringToDate;

    // Mock NivelEducacional
    spyOn(NivelEducacional, 'getNivelEducacionalById').and.callFake(MockNivelEducacional.getNivelEducacionalById);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    jasmine.clock().uninstall();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initializeDataBase', () => {
    it('should initialize the database and create test users', async () => {
      sqliteService.open.and.returnValue(Promise.resolve(mockDb));
      spyOn(service, 'createTestUsers').and.returnValue(Promise.resolve());
      spyOn(service, 'readUsers').and.returnValue(Promise.resolve([]));

      await service.initializeDataBase();

      expect(sqliteService.createDataBase).toHaveBeenCalledWith({
        database: service.dataBaseName,
        upgrade: service.userUpgrades
      });
      expect(sqliteService.open).toHaveBeenCalledWith(service.dataBaseName, false, 'no-encryption', 1, false);
      expect(service.createTestUsers).toHaveBeenCalled();
      expect(service.readUsers).toHaveBeenCalled();
    });

    it('should handle errors during database initialization', async () => {
      const error = new Error('Initialization failed');
      sqliteService.createDataBase.and.returnValue(Promise.reject(error));

      await service.initializeDataBase();

      expect(showAlertError).toHaveBeenCalledWith('DataBaseService.initializeDataBase', error);
    });
  });

  describe('createTestUsers', () => {
    it('should create test users if they do not exist', async () => {
      const mockReadUser = spyOn(service, 'readUser').and.returnValue(Promise.resolve(undefined));
      const mockSaveUser = spyOn(service, 'saveUser').and.returnValue(Promise.resolve());

      await service.createTestUsers();

      expect(mockReadUser).toHaveBeenCalledTimes(4);
      expect(mockSaveUser).toHaveBeenCalledTimes(4);
      expect(mockSaveUser).toHaveBeenCalledWith(service.testUser1);
      expect(mockSaveUser).toHaveBeenCalledWith(service.testUser2);
      expect(mockSaveUser).toHaveBeenCalledWith(service.testUser3);
      expect(mockSaveUser).toHaveBeenCalledWith(service.testUser4);
    });

    it('should not create test users if they already exist', async () => {
      const mockReadUser = spyOn(service, 'readUser').and.returnValue(Promise.resolve(new User()));
      const mockSaveUser = spyOn(service, 'saveUser').and.returnValue(Promise.resolve());

      await service.createTestUsers();

      expect(mockReadUser).toHaveBeenCalledTimes(4);
      expect(mockSaveUser).not.toHaveBeenCalled();
    });

    it('should handle errors during test user creation', async () => {
      const error = new Error('Creation failed');
      spyOn(service, 'readUser').and.returnValue(Promise.reject(error));

      await service.createTestUsers();

      expect(showAlertError).toHaveBeenCalledWith('DataBaseService.createTestUsers', error);
    });
  });

  describe('saveUser', () => {
    it('should save a user and refresh the user list', async () => {
      const user = service.testUser1;
      (mockDb.run as jasmine.Spy).and.returnValue(Promise.resolve({ changes: { changes: 1 } }));
      spyOn(service, 'readUsers').and.returnValue(Promise.resolve([user]));

      await service.saveUser(user);

      expect(mockDb.run).toHaveBeenCalledWith(service.sqlInsertUpdate, [
        user.userName,
        user.email,
        user.password,
        user.secretQuestion,
        user.secretAnswer,
        user.firstName,
        user.lastName,
        user.educationalLevel.id,
        convertDateToString(user.dateOfBirth),
        user.address,
        user.image,
        user.role
      ]);
      expect(service.readUsers).toHaveBeenCalled();
    });

    it('should handle errors during user save', async () => {
      const user = service.testUser1;
      const error = new Error('Save failed');
      (mockDb.run as jasmine.Spy).and.returnValue(Promise.reject(error));

      await service.saveUser(user);

      expect(showAlertError).toHaveBeenCalledWith('DataBaseService.saveUser', error);
    });
  });

  describe('readUsers', () => {
    it('should read all users and update the userList', async () => {
      const users = [service.testUser1, service.testUser2];
      const mockRows = users.map(user => ({
        userName: user.userName,
        email: user.email,
        password: user.password,
        secretQuestion: user.secretQuestion,
        secretAnswer: user.secretAnswer,
        firstName: user.firstName,
        lastName: user.lastName,
        educationalLevel: user.educationalLevel.id,
        dateOfBirth: convertDateToString(user.dateOfBirth),
        address: user.address,
        image: user.image,
        role: user.role
      }));
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ values: mockRows }));

      spyOn<any>(service, 'rowToUser').and.callFake((row: any) => {
        return Object.assign(new User(), {
          userName: row.userName,
          email: row.email,
          password: row.password,
          secretQuestion: row.secretQuestion,
          secretAnswer: row.secretAnswer,
          firstName: row.firstName,
          lastName: row.lastName,
          educationalLevel: NivelEducacional.getNivelEducacionalById(row.educationalLevel),
          dateOfBirth: convertStringToDate(row.dateOfBirth),
          address: row.address,
          image: row.image,
          role: row.role
        });
      });

      const result = await service.readUsers();

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM USER;');
      expect(service.rowToUser).toHaveBeenCalledTimes(2);
      expect(service.userList.value).toEqual(users);
      expect(result).toEqual(users);
    });

    it('should return an empty array if no users are found', async () => {
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ values: [] }));

      const result = await service.readUsers();

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM USER;');
      expect(service.userList.value).toEqual([]);
      expect(result).toEqual([]);
    });

    it('should handle errors during reading users', async () => {
      const error = new Error('Read failed');
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.reject(error));

      const result = await service.readUsers();

      expect(showAlertError).toHaveBeenCalledWith('DataBaseService.readUsers', error);
      expect(result).toEqual([]);
    });
  });

  describe('readUser', () => {
    it('should read a user by userName', async () => {
      const user = service.testUser1;
      const mockRow = {
        userName: user.userName,
        email: user.email,
        password: user.password,
        secretQuestion: user.secretQuestion,
        secretAnswer: user.secretAnswer,
        firstName: user.firstName,
        lastName: user.lastName,
        educationalLevel: user.educationalLevel.id,
        dateOfBirth: convertDateToString(user.dateOfBirth),
        address: user.address,
        image: user.image,
        role: user.role
      };
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ values: [mockRow] }));

      spyOn(service, 'rowToUser').and.returnValue(user);

      const result = await service.readUser(user.userName);

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM USER WHERE userName=?;', [user.userName]);
      expect(service.rowToUser).toHaveBeenCalledWith(mockRow);
      expect(result).toEqual(user);
    });

    it('should return undefined if user is not found', async () => {
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ values: [] }));

      const result = await service.readUser('nonexistent');

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM USER WHERE userName=?;', ['nonexistent']);
      expect(result).toBeUndefined();
    });

    it('should handle errors during reading a user', async () => {
      const error = new Error('Read user failed');
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.reject(error));

      const result = await service.readUser('anyuser');

      expect(showAlertError).toHaveBeenCalledWith('DataBaseService.readUser', error);
      expect(result).toBeUndefined();
    });
  });

  describe('deleteByUserName', () => {
    it('should delete a user by userName and return true if successful', async () => {
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ changes: { changes: 1 } }));
      spyOn(service, 'readUsers').and.returnValue(Promise.resolve([]));

      const result = await service.deleteByUserName('atorres');

      expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM USER WHERE userName=?', ['atorres']);
      expect(service.readUsers).toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('should return false if no rows were affected', async () => {
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ changes: { changes: 0 } }));
      spyOn(service, 'readUsers').and.returnValue(Promise.resolve([]));

      const result = await service.deleteByUserName('atorres');

      expect(mockDb.run).toHaveBeenCalledWith('DELETE FROM USER WHERE userName=?', ['atorres']);
      expect(service.readUsers).toHaveBeenCalled();
      expect(result).toBeFalse();
    });

    it('should handle errors during deletion', async () => {
      const error = new Error('Delete failed');
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.reject(error));

      const result = await service.deleteByUserName('atorres');

      expect(showAlertError).toHaveBeenCalledWith('DataBaseService.deleteByUserName', error);
      expect(result).toBeFalse();
    });
  });

  describe('updateUser', () => {
    it('should update a user and return true if successful', async () => {
      const user = service.testUser1;
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ changes: { changes: 1 } }));
      spyOn(service, 'readUsers').and.returnValue(Promise.resolve([user]));

      const result = await service.updateUser(user);

      expect(mockDb.run).toHaveBeenCalledWith(service.sqlInsertUpdate, [
        user.userName,
        user.email,
        user.password,
        user.secretQuestion,
        user.secretAnswer,
        user.firstName,
        user.lastName,
        user.educationalLevel.id,
        convertDateToString(new Date(user.dateOfBirth)),
        user.address,
        user.image,
        user.role
      ]);
      expect(service.readUsers).toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('should return false if no rows were affected', async () => {
      const user = service.testUser1;
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ changes: { changes: 0 } }));
      spyOn(service, 'readUsers').and.returnValue(Promise.resolve([]));

      const result = await service.updateUser(user);

      expect(mockDb.run).toHaveBeenCalledWith(service.sqlInsertUpdate, [
        user.userName,
        user.email,
        user.password,
        user.secretQuestion,
        user.secretAnswer,
        user.firstName,
        user.lastName,
        user.educationalLevel.id,
        convertDateToString(new Date(user.dateOfBirth)),
        user.address,
        user.image,
        user.role
      ]);
      expect(service.readUsers).toHaveBeenCalled();
      expect(result).toBeFalse();
    });

    it('should handle errors during user update', async () => {
      const user = service.testUser1;
      const error = new Error('Update failed');
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.reject(error));

      try {
        await service.updateUser(user);
        fail('Expected updateUser to throw an error');
      } catch (e) {
        expect(showAlertError).toHaveBeenCalledWith('DataBaseService.updateUser', error);
      }
    });
  });

  describe('findUser', () => {
    it('should find a user by userName or email and password', async () => {
      const user = service.testUser1;
      const mockRow = {
        userName: user.userName,
        email: user.email,
        password: user.password,
        secretQuestion: user.secretQuestion,
        secretAnswer: user.secretAnswer,
        firstName: user.firstName,
        lastName: user.lastName,
        educationalLevel: user.educationalLevel.id,
        dateOfBirth: convertDateToString(user.dateOfBirth),
        address: user.address,
        image: user.image,
        role: user.role
      };
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ values: [mockRow] }));
      spyOn(service, 'rowToUser').and.returnValue(user);

      const result = await service.findUser('atorres', '1234');

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM USER WHERE userName=? OR email=? AND password=?;', ['atorres', '1234']);
      expect(service.rowToUser).toHaveBeenCalledWith(mockRow);
      expect(result).toEqual(user);
    });

    it('should return undefined if no user is found', async () => {
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ values: [] }));

      const result = await service.findUser('nonexistent', 'password');

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM USER WHERE userName=? OR email=? AND password=?;', ['nonexistent', 'password']);
      expect(result).toBeUndefined();
    });

    it('should handle errors during finding a user', async () => {
      const error = new Error('Find failed');
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.reject(error));

      const result = await service.findUser('atorres', '1234');

      expect(showAlertError).toHaveBeenCalledWith('DataBaseService.findUser', error);
      expect(result).toBeUndefined();
    });
  });

  describe('findUserByUserName', () => {
    it('should find a user by userName', async () => {
      const user = service.testUser1;
      const mockRow = {
        userName: user.userName,
        email: user.email,
        password: user.password,
        secretQuestion: user.secretQuestion,
        secretAnswer: user.secretAnswer,
        firstName: user.firstName,
        lastName: user.lastName,
        educationalLevel: user.educationalLevel.id,
        dateOfBirth: convertDateToString(user.dateOfBirth),
        address: user.address,
        image: user.image,
        role: user.role
      };
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ values: [mockRow] }));
      spyOn(service, 'rowToUser').and.returnValue(user);

      const result = await service.findUserByUserName('atorres');

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM USER WHERE userName=?;', ['atorres']);
      expect(service.rowToUser).toHaveBeenCalledWith(mockRow);
      expect(result).toEqual(user);
    });

    it('should return undefined if user is not found', async () => {
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ values: [] }));

      const result = await service.findUserByUserName('nonexistent');

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM USER WHERE userName=?;', ['nonexistent']);
      expect(result).toBeUndefined();
    });

    it('should handle errors during finding a user by userName', async () => {
      const error = new Error('Find by userName failed');
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.reject(error));

      const result = await service.findUserByUserName('atorres');

      expect(showAlertError).toHaveBeenCalledWith('DataBaseService.findUserByEmail', error);
      expect(result).toBeUndefined();
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const user = service.testUser1;
      const mockRow = {
        userName: user.userName,
        email: user.email,
        password: user.password,
        secretQuestion: user.secretQuestion,
        secretAnswer: user.secretAnswer,
        firstName: user.firstName,
        lastName: user.lastName,
        educationalLevel: user.educationalLevel.id,
        dateOfBirth: convertDateToString(user.dateOfBirth),
        address: user.address,
        image: user.image,
        role: user.role
      };
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ values: [mockRow] }));
      spyOn(service, 'rowToUser').and.returnValue(user);

      const result = await service.findUserByEmail('atorres@duocuc.cl');

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM USER WHERE email=?;', ['atorres@duocuc.cl']);
      expect(service.rowToUser).toHaveBeenCalledWith(mockRow);
      expect(result).toEqual(user);
    });

    it('should return undefined if user is not found by email', async () => {
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.resolve({ values: [] }));

      const result = await service.findUserByEmail('nonexistent@duocuc.cl');

      expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM USER WHERE email=?;', ['nonexistent@duocuc.cl']);
      expect(result).toBeUndefined();
    });

    it('should handle errors during finding a user by email', async () => {
      const error = new Error('Find by email failed');
      (mockDb.query as jasmine.Spy).and.returnValue(Promise.reject(error));

      const result = await service.findUserByEmail('atorres@duocuc.cl');

      expect(showAlertError).toHaveBeenCalledWith('DataBaseService.findUserByEmail', error);
      expect(result).toBeUndefined();
    });
  });

  describe('rowToUser', () => {
    it('should convert a database row to a User object', () => {
      const row = {
        userName: 'atorres',
        email: 'atorres@duocuc.cl',
        password: '1234',
        secretQuestion: '¿Cuál es tu animal favorito?',
        secretAnswer: 'gato',
        firstName: 'Ana',
        lastName: 'Torres',
        educationalLevel: 6,
        dateOfBirth: '2000-01-05T00:00:00.000Z',
        address: 'La Florida',
        image: 'default-image.jpg',
        role: 'user'
      };

      const expectedUser = new User();
      expectedUser.userName = 'atorres';
      expectedUser.email = 'atorres@duocuc.cl';
      expectedUser.password = '1234';
      expectedUser.secretQuestion = '¿Cuál es tu animal favorito?';
      expectedUser.secretAnswer = 'gato';
      expectedUser.firstName = 'Ana';
      expectedUser.lastName = 'Torres';
      expectedUser.educationalLevel = NivelEducacional.getNivelEducacionalById(6)!;
      expectedUser.dateOfBirth = new Date('2000-01-05T00:00:00.000Z');
      expectedUser.address = 'La Florida';
      expectedUser.image = 'default-image.jpg';
      expectedUser.role = 'user';

      const user = service.rowToUser(row);

      expect(user).toEqual(expectedUser);
    });

    it('should handle errors during row to user conversion', () => {
      const row = null;
      const user = service.rowToUser(row);

      expect(showAlertError).toHaveBeenCalledWith('DataBaseService.rowToUser', jasmine.any(Error));
      expect(user).toEqual(new User());
    });
  });
});