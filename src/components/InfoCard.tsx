import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface InfoItem {
  label: string;
  value: string;
  colorClass?: string;
}

interface InfoCardProps {
  title: string;
  icon: LucideIcon;
  items: InfoItem[][];
}

export function InfoCard({ title, icon: Icon, items }: InfoCardProps) {
  return (
    <Card className="lg:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {items.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-2">
              {column.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className="flex justify-start items-center"
                >
                  <span className="text-xs text-muted-foreground">
                    {item.label}
                  </span>
                  <span
                    className={`text-xs font-medium ${item.colorClass || ''}`}
                  >
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
