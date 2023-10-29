import { Test, TestingModule } from '@nestjs/testing';
import { GoogleCalendarController } from './google-calendar.controller';
import { GoogleCalendarDataAccessModule } from '../data-access/google-calendar-data-access.module';
import { GoogleCalendarService } from '../data-access/google-calendar.service';
import { CoreModule } from '../../core/feature/core.module';

describe('GoogleCalendarController', () => {
  let controller: GoogleCalendarController;
  let service: GoogleCalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleCalendarController],
      imports: [CoreModule, GoogleCalendarDataAccessModule],
    }).compile();

    controller = module.get<GoogleCalendarController>(GoogleCalendarController);
    service = module.get(GoogleCalendarService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should generate auth url', () => {
    const url = 'http://test.com';
    jest.spyOn(service, 'generateAuthUrl').mockReturnValue(url);
    expect(controller.generateAuthUrl()).toEqual({
      url,
    });
  });
});
