import Typography from "@material-ui/core/Typography";
import { DataGrid } from "@material-ui/data-grid";
import LaunchIcon from "@material-ui/icons/Launch";
import React, { Fragment, useEffect } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from 'react-router-dom';

import { clearErrors, myOrders } from "../../actions/orderAction";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

import "./MyOrders.css";

const MyOrders = () => {

    const dispatch = useDispatch();
    const { id } = useParams();
    const alert = useAlert();

    const { loading, error, orders } = useSelector((state) => state.myOrders);
    const { user } = useSelector((state) => state.user);

    const columns = [
        { field: 'id', headerName: 'Order ID', minWidth: 300, flex: 1 },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 150,
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(id, 'status') === 'Delivered'
                    ? 'greenColor'
                    : 'redColor';
            },
        },
        {
            field: 'itemsQty',
            headerName: 'Items Qty',
            type: 'number',
            minWidth: 150,
            flex: 0.3,
        },
        {
            field: 'amount',
            headerName: 'Amount',
            type: 'number',
            minWidth: 270,
            flex: 0.5,
        },
        {
            field: 'actions',
            flex: 0.3,
            headerName: 'Actions',
            minWidth: 150,
            type: 'number',
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/order/${params.getValue( id, 'id')}`}>
                        <LaunchIcon />
                    </Link>
                );
            },
        },
    ];
    const rows = [];

    orders && orders.forEach((item, index) => {
        rows.push({
            itemsQty: item.orderItems.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice,
        });
    });

    useEffect(() => {
        if (error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        dispatch(myOrders());
    }, [dispatch, alert, error]);

  return (
      <Fragment>
          <MetaData title={`${user.name} - Orders`} />
          {loading ? (
              <Loader />
          ) : (
                  <div className="myOrdersPage">
                      <DataGrid
                          rows={rows}
                          columns={columns}
                          pageSize= {10}
                          disableSelectionOnClick
                          className="myOrdersTable"
                          autoHeight
                      />

                      <Typography id="myOrdersHeading">{user.name}'s Orders</Typography>
              </div>
          )}
    </Fragment>
  )
}

export default MyOrders;