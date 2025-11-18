import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CalendarA11y, CalendarDateFormatter, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarEventTitleFormatter, CalendarModule, CalendarUtils, CalendarView, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { startOfToday, addWeeks, subWeeks, subMonths, addMonths, endOfWeek, isValid } from 'date-fns';
import { EventColor } from 'calendar-utils';
import { CustomDateFormatter } from './providers/custom-date.provider';
import { ReportService } from '../../services/reports.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalDisplayComponent } from '../../components/modal-display/modal-display.component';
import { firstValueFrom } from 'rxjs';
import { colors } from './constants/colors.constant';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';


@Component({
    selector: 'app-home',
    imports: [CalendarModule, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    providers: [
        CalendarA11y,
        CalendarUtils,
        { provide: DateAdapter, useFactory: adapterFactory },
        { provide: CalendarEventTitleFormatter, useClass: CalendarEventTitleFormatter },
        { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
        AuthService
    ]
})
export class HomeComponent {
  public locale: string = 'sr-Latn';
  public viewDate: Date = new Date();
  public actions: CalendarEventAction[] = [];
  public events: CalendarEvent[] = [];
  public username: string = '';
  public lastWeekEvents: any[] = [];
  view: CalendarView = CalendarView.Week;

  outsideEvents = [
    { title: 'Event 1', start: new Date(), end: new Date(), color: { primary: '#e3bc08', secondary: '#FDF1BA' } },
    { title: 'Event 2', start: new Date(), end: new Date() }
  ];

endDate: any;
startDate: any;
currentView: CalendarView = CalendarView.Week;
public CalendarView = CalendarView;
refresh: Subject<void> = new Subject();
  constructor(
    public reportService: ReportService,
    private _dialog: MatDialog,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername(); // Get the username
    // ovo se prvo poziva u komponenti kad se inicijalizuje prikaz
    // radi se "subscribe na event" kada se iz modala klikne na submit, onda se ovde dobije taj objekat koji smo uneli
    // u ovom trenutku se nista ne desava u ovoj metodi, vec si se samo subscribe na event koji ce se desiti u buducnosti
    this._subscribeOnAddReportModalAction(); 
    this._subscribeOnUpdateReportModalAction();

    //kad odradis delete refreshuje tako sto fecuje sve iz baze
    this.reportService.refreshView.subscribe(() => {
      this._fetchEventsAndFormatForTheCalendar();
    });
    
    // salje se poziv ka backend-u 
    this._fetchEventsAndFormatForTheCalendar();
    this.updateDateRange();
  }

  changeViewToWeek(): void {
    this.view = CalendarView.Week
    this.currentView = CalendarView.Week;
    this.updateDateRange();
  }

  changeViewToMonth(): void {
    this.view = CalendarView.Month
    this.currentView = CalendarView.Month;
    this.updateDateRange();
  }

  private updateDateRange(): void {
    if (this.view === CalendarView.Week) {
      const startOfWeek = this.startOfWeek(this.viewDate);
      this.startDate = startOfWeek;
      this.endDate = addWeeks(startOfWeek, 1);
      return;
    }

    this.startDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);
    this.endDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0);
  }

  private startOfWeek(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day; 
    return new Date(date.setDate(diff));
  }

  private _subscribeOnAddReportModalAction(): void {
    // Poziv ka backendu da se dovuku svi report-i iz BAZE
    this.reportService.addReport.subscribe((report: any) => {
      // dovuceni su i formatiraju se za kalendar
      this._handleNewReport(report);
    });
  }

  private _subscribeOnUpdateReportModalAction(): void {
    this.reportService.updateReport.subscribe((report: any) => {
      const inx = this.events.findIndex(event => event.meta.id === report.id);
      if (inx === -1) {
        return;
      }

      this.events[inx].meta = report;
      this.reportService.refreshView.next();
    });
  }
  
  private _handleNewReport(report: any): void {
    const calendarEvent = this._formatReportToCalendarEvent(report);
    calendarEvent.draggable = true;
    // Poziv ka backend-u da se sacuva report
    this.reportService.save(calendarEvent.meta).subscribe(() => {
      // ubacujes u niz koji se prikazuje
      this.events.push(calendarEvent);
      // osvezavas kalendar kako bi prikazao nove reporte
      this.reportService.refreshView.next();
    });
  }

  private _populateEventBar(events: any[]): void {
    this.lastWeekEvents = events;
  }

  private async _fetchEventsFromLastWeek(): Promise<void> {
    try {
      // pocetni i krajnji dan za proslu nedelju
      const lastWeekStart = this.startOfWeek(subWeeks(startOfToday(), 1));
      const lastWeekEnd = endOfWeek(lastWeekStart);

      
      const lastWeekEvents = this.events
        .filter(report => {
          const eventDate = new Date(report.meta.date);
          return (
            isValid(eventDate) &&
            eventDate >= lastWeekStart &&
            eventDate <= lastWeekEnd &&
            !report.meta.departure_time
          );
        })
        .map(report => this._formatReportToCalendarEvent(report.meta));
  
      
      this._populateEventBar(lastWeekEvents);
  
    } catch (error) {
      console.error('Error fetching reports:', error);
      
    }
  }
  
  private async _fetchEventsAndFormatForTheCalendar(): Promise<void> {
    // tehnika hvatanja response-a sa backend-a
    const reports: any[] = await firstValueFrom(
      // ovo je taj poziv koji vraca observable 
      this.reportService.getReports()
    );

    // smestanje u events svih dovucenih report-a sa backend-a
    this.events = reports.map(report => this._formatReportToCalendarEvent(report));
    this._fetchEventsFromLastWeek();
  }

  logout(): void {
    this.authService.logout(); 
  }

  onDragStart(event: DragEvent, calendarEvent: any): void {
    
    event.dataTransfer?.setData('eventData', JSON.stringify(calendarEvent));
  }

  onDrop(event: DragEvent): void {
  event.preventDefault();

  const eventData = event.dataTransfer?.getData('eventData');
  if (!eventData) return;

  const draggedEvent: CalendarEvent = JSON.parse(eventData);

  const column = (event.target as HTMLElement)?.closest('.cal-day-column');
  if (!column) return;

  const columnIndex = Array.from(column.parentElement!.children).indexOf(column);
  if (columnIndex === -1) return;

  const viewStart = this.view === CalendarView.Week
    ? this.startOfWeek(new Date(this.viewDate))
    : new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1);

  const excludeDays = [0]; // Sundays
  const droppedDate = new Date(viewStart);
  let i = 0;
  while (i < columnIndex) {
    droppedDate.setDate(droppedDate.getDate() + 1);
    if (!excludeDays.includes(droppedDate.getDay())) i++;
  }

  const rect = column.getBoundingClientRect();
  const offsetY = event.clientY - rect.top;

  const SLOT_HEIGHT = 30;
  const START_HOUR = 7;
  const slots = Math.floor(offsetY / SLOT_HEIGHT);

  const newHour = START_HOUR + Math.floor(slots / 2);
  const newMinutes = (slots % 2) * 30;

  droppedDate.setHours(newHour, newMinutes, 0, 0);

  // Compute duration from original event
  const startParts = draggedEvent.meta.start_time.split(':').map(Number);
  const endParts = draggedEvent.meta.end_time.split(':').map(Number);
  const originalStartMin = startParts[0] * 60 + startParts[1];
  const originalEndMin = endParts[0] * 60 + endParts[1];
  const durationMin = originalEndMin - originalStartMin;
  const endDate = new Date(droppedDate.getTime() + durationMin * 60000);

  // Update via helper
  this._updateEventTime(draggedEvent, droppedDate, endDate);
}


 
  
  allowDrop(event: DragEvent): void {
    event.preventDefault(); 
  }

  private _formatReportToCalendarEvent(report: any): CalendarEvent {
    const { date, start_time, end_time, company_name, id } = report;
  
    const startDate = new Date(date);
    const [startHours, startMinutes] = start_time.split(':').map(Number);
    const [endHours, endMinutes] = end_time.split(':').map(Number);
  
    const roundedStartMinutes = startMinutes < 30 ? 0 : 30;
    const roundedEndMinutes = endMinutes < 30 ? 0 : 30;
  
    startDate.setHours(startHours, roundedStartMinutes, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(endHours, roundedEndMinutes, 0, 0);
  
    return {
      start: startDate,
      end: endDate,
      title: company_name,
      color: this._getColorForEvent(startDate),
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
      meta: { ...report, id },
    };
  }
  
  private _getColorForEvent(startDate: Date): EventColor {
    const currentDate = new Date();
    const startOfToday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    if (startDate < currentDate) {
        return colors['red'];
    } else if (startDate >= currentDate && startDate < startOfTomorrow) {
        return colors['yellow'];
    } else {
        return colors['green'];
    }
}


  goToPrevious(): void {
    this.viewDate = this.view === CalendarView.Week
    ? subWeeks(this.viewDate, 1)
    : subMonths(this.viewDate, 1);
    this.updateDateRange();
  }

  goToCurrent(): void {
    this.viewDate = startOfToday();
    this.updateDateRange();
  }

  goToNext(): void {
    this.viewDate = this.view === CalendarView.Week
      ? addWeeks(this.viewDate, 1)
      : addMonths(this.viewDate, 1);
      this.updateDateRange();
  }

  openDialog(event: any): void {
    this._dialog.open(ModalDisplayComponent, {
      width: '600px',
      data: event
    });
  }

  private _updateEventTime(
  event: CalendarEvent,
  newStart: Date,
  newEnd?: Date
): void {
  // Ensure 'end' is always a valid Date
  const end: Date = newEnd ?? new Date(newStart.getTime() + 30 * 60 * 1000); // default 30 min if undefined

  // Build new event object (do not mutate original)
  const updatedEvent: CalendarEvent = {
    ...event,
    start: newStart,
    end: end,
    color: this._getColorForEvent(newStart),
    meta: {
      ...event.meta,
      start_time: `${String(newStart.getHours()).padStart(2,'0')}:${String(newStart.getMinutes()).padStart(2,'0')}`,
      end_time: `${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`,
      date: newStart.toISOString().split('T')[0]
    }
  };

  // Replace event in events array
  this.events = this.events.map(e => e.meta.id === event.meta.id ? updatedEvent : e);

  // Refresh calendar view
  this.refresh.next();

  // Update backend
  this.reportService.update(updatedEvent.meta, updatedEvent.meta.id)
    .subscribe(() => console.log('Event updated successfully'));
}

 eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {
  this._updateEventTime(event, newStart, newEnd);
}


  handleEvent(action: string, event: CalendarEvent): void {
    this.openDialog(event);
  }

  eventClass(event: CalendarEvent): any {
    return {
      left: {
        border: '2px solid blue'
      }
    };
  }
}

