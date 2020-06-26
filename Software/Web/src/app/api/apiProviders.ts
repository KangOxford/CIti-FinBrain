import { Binding } from "react.di";
import { UserService } from "./UserService";
import { UserServiceMock } from "./mock/UserServiceMock";
import { HttpService } from "./HttpService";
import { NotificationService } from "./NotificationService";
import { NotificationServiceMock } from "./mock/NotificationServiceMock";
import { InvreqService } from "./InvreqService";
import { InvreqServiceMock } from "./mock/InvreqServiceMock";
import { QuotationService } from "./QuotationService";
import { QuotationServiceMock } from "./mock/QuotationServiceMock";
import { StockAnalysisService } from "./StockAnalysisService";
import { StockAnalysisServiceMock } from "./mock/StockAnalysisServiceMock";
import { BondAnalysisService } from "./BondAnalysisService";
import { BondAnalysisServiceMock } from "./mock/BondAnalysisServiceMock";
import { ProductAnalysisService } from "./ProductAnalysisService";
import { ProductAnalysisServiceMock } from "./mock/ProductAnalysisServiceMock";

export default function(useMock: boolean) {
  return [
    {provide: UserService, useClass: useMock ? UserServiceMock : UserService},
    {provide: HttpService, useClass: HttpService},
    {provide: NotificationService, useClass: useMock ? NotificationServiceMock : NotificationService},
    {provide: InvreqService, useClass: useMock ? InvreqServiceMock : InvreqService},
    {provide: QuotationService, useClass: useMock ? QuotationServiceMock : QuotationService},
    {provide: StockAnalysisService, useClass: useMock ? StockAnalysisServiceMock : StockAnalysisService},
    {provide: BondAnalysisService, useClass: useMock ? BondAnalysisServiceMock : BondAnalysisService},
    {provide: ProductAnalysisService, useClass: useMock ? ProductAnalysisServiceMock : ProductAnalysisService},
  ] as Binding[];
}
