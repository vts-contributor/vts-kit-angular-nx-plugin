import { Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { Product, ProductDetail, ProductStatistic } from '../models/mock';
import { shuffle } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  constructor() {}

  loadProduct$(): Observable<Product[]> {
    return of(0).pipe(
      delay(Math.ceil(Math.random() * 5) * 1000),
      map(() =>
        shuffle([
          {
            id: Math.random().toString(),
            name: 'Lorem Ipsum',
            description:
              "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            createdBy: 'lorem@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Lorem',
            description:
              'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
            createdBy: 'ipsum@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Extremes of Good',
            description:
              'Contrary to popular belief, Lorem Ipsum is not simply random text',
            createdBy: 'contrary@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'LoremIpsum',
            description:
              "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            createdBy: 'lorem@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Opsum',
            description:
              'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
            createdBy: 'ipsum@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Extremes',
            description:
              'Contrary to popular belief, Lorem Ipsum is not simply random text',
            createdBy: 'contrary@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Good Ipsum',
            description:
              "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            createdBy: 'lorem@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Lorem Bad',
            description:
              'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
            createdBy: 'ipsum@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Extremes Good',
            description:
              'Contrary to popular belief, Lorem Ipsum is not simply random text',
            createdBy: 'contrary@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Extrem Good',
            description:
              'Contrary to popular belief, Lorem Ipsum is not simply random text',
            createdBy: 'contrary@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Lorem Ipsum',
            description:
              "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            createdBy: 'lorem@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Lorem',
            description:
              'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
            createdBy: 'ipsum@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Extremes of Good',
            description:
              'Contrary to popular belief, Lorem Ipsum is not simply random text',
            createdBy: 'contrary@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'LoremIpsum',
            description:
              "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            createdBy: 'lorem@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Opsum',
            description:
              'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
            createdBy: 'ipsum@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Extremes',
            description:
              'Contrary to popular belief, Lorem Ipsum is not simply random text',
            createdBy: 'contrary@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Good Ipsum',
            description:
              "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s",
            createdBy: 'lorem@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Lorem Bad',
            description:
              'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour',
            createdBy: 'ipsum@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Extremes Good',
            description:
              'Contrary to popular belief, Lorem Ipsum is not simply random text',
            createdBy: 'contrary@viettel.com.vn',
          },
          {
            id: Math.random().toString(),
            name: 'Extrem Good',
            description:
              'Contrary to popular belief, Lorem Ipsum is not simply random text',
            createdBy: 'contrary@viettel.com.vn',
          },
        ])
      )
    );
  }

  loadStatistic$(): Observable<ProductStatistic> {
    return of(0).pipe(
      delay(Math.ceil(Math.random() * 5) * 1000),
      map(() => ({
        donut: {
          chartOptions: {
            series: [50, 34, 96, 20],
            chart: {
              type: 'donut',
              width: 510,
              height: 220,
            },
            colors: ['#708C95', '#385A64', '#004E7A', '#F88240'],
            labels: ['No process', 'Processing', 'Processed', 'Out of date'],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: 'bottom',
                  },
                },
              },
            ],
            title: {
              text: 'Donut Chart Title',
              align: 'center',
            },
          },
          donutChartOptions: {
            title: '25.145',
            subtitle: 'Offers',
          },
        },
        line: {
          chartOptions: {
            series: [
              {
                name: 'Network',
                data: [
                  {
                    x: 0,
                    y: 210,
                  },
                  {
                    x: 3,
                    y: 180,
                  },
                  {
                    x: 6,
                    y: 90,
                  },
                  {
                    x: 9,
                    y: 180,
                  },
                  {
                    x: 12,
                    y: 200,
                  },
                  {
                    x: 15,
                    y: 150,
                  },
                  {
                    x: 18,
                    y: 100,
                  },
                  {
                    x: 21,
                    y: 70,
                  },
                  {
                    x: 24,
                    y: 145,
                  },
                ],
              },
            ],
            chart: {
              type: 'area',
              height: 350,
            },
            colors: ['#C65312'],
            fill: {
              colors: ['#C0CFD3', '#C0CFD3'],
            },
            markers: {
              size: 5,
              colors: ['#F80035'],
            },
            xaxis: {
              min: 0,
              max: 24,
              tickAmount: 9,
              overwriteCategories: Array.from({ length: 9 }).map(
                (_, idx) => `${idx * 3}h`
              ),
            },
            title: {
              text: 'Line Chart Title',
              align: 'left',
            },
          },
        },
      }))
    );
  }

  loadDetail$(): Observable<ProductDetail> {
    return of(0).pipe(
      delay(Math.ceil(Math.random() * 5) * 1000),
      map(() => ({
        name: 'Cloud Database',
        billing: 'Prepaid',
        renewal: true,
        orderTime: '2018-04-24 18:00:00',
        usageTime: '2018-04-24 18:00:00 To 2019-04-24 18:00:00',
        status: 'Running',
        negotiatedAmount: '$80.00',
        discount: '$20.00',
        officialReceipts: '$60.00',
        configInfo: [
          'Data disk type: MongoDB',
          'Database version: 3.4',
          'Package: dds.mongo.mid',
          'Storage space: 10 GB',
          'Replication_factor:3',
          'Region: East China 1',
        ],
      }))
    );
  }
}
