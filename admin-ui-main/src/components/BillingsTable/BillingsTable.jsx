import React from "react";

import {
  ColumnDirective,
  GridComponent,
  ColumnsDirective,
  Page,
  Inject,
  Sort,
  Search,
  Toolbar,
  Edit,
} from "@syncfusion/ej2-react-grids";
import data from "./dataSource-Billing.json";
import "./billingstable.scss";

const BillingsTable = ({height}) => {
  const selection_settings = { checkboxMode: "ResetOnRowClick" };

  return (
    <div className="etable">
      <GridComponent
        dataSource={data}
        allowPaging={true}
        pageSettings={{ pageSize: 6 }}
        height={height}
        allowSorting={true}
        selectionSettings={selection_settings}
        gridLines="None"
      >
        <ColumnsDirective>
          <ColumnDirective type="checkbox" width="50" />
          <ColumnDirective
            field="ID"
            headerText="Invoice ID"
            textAlign="left"
            width={"100%"}
          ></ColumnDirective>
          <ColumnDirective
            field="Name"
            headerText="Patient Name"
            textAlign="left"
            width={"100%"}
          ></ColumnDirective>
          <ColumnDirective
            field="date-issue"
            headerText="Date Issued"
            textAlign="left"
            width={"100%"}
          ></ColumnDirective>
          <ColumnDirective
            field="duedate"
            headerText="Due Date"
            textAlign="left"
            width={"100%"}
          ></ColumnDirective>
          <ColumnDirective
            field="Due"
            headerText="Amount Due"
            textAlign="left"
            width={"100%"}
          ></ColumnDirective>
          <ColumnDirective
            field="Status"
            headerText="Status"
            textAlign="left"
            width={"50%"}
          ></ColumnDirective>
        </ColumnsDirective>
        <Inject services={[Page, Sort, Search, Toolbar, Edit]} />
      </GridComponent>
    </div>
  );
};

export default BillingsTable;