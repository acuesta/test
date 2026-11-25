import { ArrayMinSize, IsArray, IsInt, IsString, Min } from 'class-validator';

export class SubmitSolutionDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  culprits!: string[];

  @IsInt()
  @Min(0)
  elapsedSeconds!: number;
}
