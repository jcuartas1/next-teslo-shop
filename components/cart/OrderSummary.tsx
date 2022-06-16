import { Grid, Typography } from "@mui/material"
import { useContext } from 'react';
import { CartContext } from "../../context";
import { currency } from "../../utils";
import { NextPage } from 'next';
import { IOrder } from "../../interfaces";


interface Props {
  order?: IOrder
}

export const OrderSummary:NextPage<Props> = ({ order }) => {

  let numberOfItemsGlobal = 0;
  let subTotalGlobal = 0;
  let totalGlobal = 0;
  let taxGlobal = 0;

  if(order){

    numberOfItemsGlobal = order.numberOfItems;
    subTotalGlobal = order.subTotal;
    taxGlobal = order.tax;
    totalGlobal = order.total;

  }else{
    const { numberOfItems, subTotal, total, tax } = useContext(CartContext)

    numberOfItemsGlobal = numberOfItems;
    subTotalGlobal = subTotal;
    totalGlobal = total;
    taxGlobal = tax;
  }

  return (
    <Grid container>
      <Grid item xs={ 6 }>
        <Typography>
          No. Productos
        </Typography>
      </Grid>
      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>
          { numberOfItemsGlobal } { numberOfItemsGlobal > 1 ? 'items' : 'item' }
        </Typography>
      </Grid>
      <Grid item xs={ 6 }>
        <Typography>
          SubTotal
        </Typography>
      </Grid>
      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>
        { currency.formmat(subTotalGlobal) }
        </Typography>
      </Grid>
      <Grid item xs={ 6 }>
        <Typography>
          Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 } %)
        </Typography>
      </Grid>
      <Grid item xs={ 6 } display='flex' justifyContent='end'>
        <Typography>
        {currency.formmat(taxGlobal)}
        </Typography>
      </Grid>
      <Grid item xs={ 6 } sx={{mt:2}}>
        <Typography variant="subtitle1">
          Total: 
        </Typography>
      </Grid>
      <Grid item xs={ 6 } sx={{mt:2}} display='flex' justifyContent='end'>
        <Typography variant="subtitle1">
        {currency.formmat(totalGlobal)}
        </Typography>
      </Grid>
    </Grid>
  )
}
