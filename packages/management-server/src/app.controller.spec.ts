import { Test, TestingModule } from '@nestjs/testing';

describe('AppController', () => {
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
    }).compile();
    console.log(app);
  });

  describe('root', () => {

  });
});
