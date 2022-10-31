import { VtsChartOptions, VtsDonutOptions } from 'ng-vts/chart';

export interface Product {
  id: string;
  name: string;
  description: string;
  createdBy: string;
}

export interface ProductStatistic {
  donut: {
    chartOptions: VtsChartOptions;
    donutChartOptions: VtsDonutOptions;
  };
  line: {
    chartOptions: VtsChartOptions;
  };
}

export interface ProductDetail {
  name: string;
  billing: string;
  renewal: boolean;
  orderTime: string;
  usageTime: string;
  status: string;
  negotiatedAmount: string;
  discount: string;
  officialReceipts: string;
  configInfo: string[];
}
