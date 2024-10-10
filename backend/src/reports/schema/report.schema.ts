/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Report extends Document {
  @Prop({ required: true })
  company_name: string;

  @Prop({ required: true })
  rn: string;

  @Prop({ required: true })
  material_type: string;

  @Prop({ required: true })
  package_number: string;

  @Prop()
  comment: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  start_time: string;

  @Prop({ required: true })
  end_time: string;

  @Prop({ required: true })
  option1time: string;

  @Prop({ required: true })
  option2time: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
