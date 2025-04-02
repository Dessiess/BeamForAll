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
      // ovo je taj poziv koji vraca observable - google sta je observable a i sta je promise
      this.reportService.getReports()
    );

    // smestanje u events svih dovucenih report-a sa backend-a
    this.events = reports.map(report => this._formatReportToCalendarEvent(report));
    this._fetchEventsFromLastWeek();
  }

  logout(): void {
    this.authService.logout(); // Call the AuthService logout method
  }

  onDragStart(event: DragEvent, calendarEvent: any): void {
    
    event.dataTransfer?.setData('eventData', JSON.stringify(calendarEvent));
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
  
    const eventData = event.dataTransfer?.getData('eventData');
    if (eventData) {
      const draggedEvent = JSON.parse(eventData);
  
      if (!event.target || !(event.target instanceof HTMLElement)) {
        return;
      }
  
      const slotHeightPx = 30;
      const startHour = 7;
      const slotsPerHour = 2;
  
      const calendarElement = (event.target as HTMLElement).closest('.cal-day-column');
      if (!calendarElement) {
        console.error('Calendar container not found');
        return;
      }
  
      // Determine the column index from the DOM element
      const columnIndex = Array.from(calendarElement.parentNode?.children || []).indexOf(calendarElement);
      if (columnIndex === -1) {
        console.error('Unable to determine column index');
        return;
      }
  
      // Define excluded days (e.g., Sundays)
      const excludeDays = [0]; // Sundays
  
      // Calculate the start of the week or current view
      const currentDate = new Date(this.viewDate);
      const startOfCurrentView = this.view === CalendarView.Week
        ? this.startOfWeek(currentDate)
        : new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
      // Calculate the dropped date while skipping excluded days
      let dayCounter = 0;
      let droppedDate = new Date(startOfCurrentView);
  
      for (let i = 0; i <= columnIndex; i++) {
        while (excludeDays.includes(droppedDate.getDay())) {
          droppedDate.setDate(droppedDate.getDate() + 1);
        }
        if (i < columnIndex) {
          droppedDate.setDate(droppedDate.getDate() + 1);
        }
      }
  
      const calendarRect = calendarElement.getBoundingClientRect();
      const dropY = event.clientY - calendarRect.top;
  
      const totalSlots = Math.floor(dropY / slotHeightPx);
      const droppedHour = startHour + Math.floor(totalSlots / slotsPerHour);
      const droppedMinutes = (totalSlots % slotsPerHour) * 30;
  
      droppedDate.setHours(droppedHour, droppedMinutes, 0, 0);
  
      const startParts = draggedEvent.meta.start_time.split(':').map(Number);
      const endParts = draggedEvent.meta.end_time.split(':').map(Number);
  
      const startDuration = startParts[0] * 3600000 + startParts[1] * 60000 + (startParts[2] || 0) * 1000;
      const endDuration = endParts[0] * 3600000 + endParts[1] * 60000 + (endParts[2] || 0) * 1000;
      const durationMs = endDuration - startDuration;
  
      const newEndTime = new Date(droppedDate.getTime() + durationMs);
  
      draggedEvent.start = droppedDate.toLocaleTimeString();
      draggedEvent.end = newEndTime.toLocaleTimeString();
  
      const eventIndex = this.events.findIndex(event => event.meta.id === draggedEvent.meta.id);
      if (eventIndex !== -1) {
        this.events[eventIndex] = { ...draggedEvent };
  
        const updatedEvent = {
          ...draggedEvent.meta,
          date: droppedDate.toISOString().split('T')[0],
          start_time: `${String(droppedDate.getHours()).padStart(2, '0')}:${String(droppedDate.getMinutes()).padStart(2, '0')}`,
          end_time: `${String(newEndTime.getHours()).padStart(2, '0')}:${String(newEndTime.getMinutes()).padStart(2, '0')}`,
        };
  
        this.reportService.update(updatedEvent, draggedEvent.meta.id).subscribe((response: any) => {
          console.log('Event updated successfully:', response);
        });
      }
    }
  }
  
  
  
  
  allowDrop(event: DragEvent): void {
    event.preventDefault(); // Necessary to allow the drop
  }

  private _formatReportToCalendarEvent(report: any): CalendarEvent {
    const { date, start_time, end_time, company_name, id } = report;
  
    const startDate = new Date(date);
    const [startHours, startMinutes] = start_time.split(':').map(Number);
    const [endHours, endMinutes] = end_time.split(':').map(Number);
  
    // Round minutes to 00 or 30
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

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    event.color = this._getColorForEvent(newStart);

    event.meta.start_time = `${String(newStart.getHours()).padStart(2, '0')}:${String(newStart.getMinutes()).padStart(2, '0')}`;
    event.meta.end_time = `${String(newEnd?.getHours()).padStart(2, '0')}:${String(newEnd?.getMinutes()).padStart(2, '0')}`;
    event.meta.date = newStart.toISOString();

    this.reportService.update(event.meta, event.meta.id).subscribe((response) => {
      console.log('Event updated successfully:', response);
    });
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

