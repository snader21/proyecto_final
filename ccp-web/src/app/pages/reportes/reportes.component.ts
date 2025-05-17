import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TagModule } from "primeng/tag";
import { CardModule } from "primeng/card";

@Component({
  selector: "app-reportes",
  templateUrl: "./reportes.component.html",
  styleUrls: ["./reportes.component.scss"],
  standalone: true,
  imports: [CommonModule, TagModule, CardModule],
})
export class ReportesComponent {}
