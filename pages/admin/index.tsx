import { AttachmentOutlined, AttachMoneyOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupAddOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material'
import React from 'react'
import { SummaryTitle } from '../../components/admin'
import { AdminLayout } from '../../components/layout'
import useSWR from 'swr';
import { Dashboard } from '../../interfaces';
import { useState, useEffect } from 'react';

const DashboarPage = () => {

  const { data, error }  = useSWR<Dashboard>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000 // 30 segundos
  })

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval( () =>{
      console.log('Tick');
      setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn -1 : 30 );
    }, 1000);
  
    return () => clearInterval(interval)
  }, [])
  

  if( !error && !data ){
    return<></>
  }

  if( error ){
    console.log({error});
    return <Typography>Error al cargar la informacion</Typography>
  }

  const { 
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    number0fClients,
    numberOfProducts,
    productosWithNoInventory,
    lowInventory,
   } = data!;

  return (
    <AdminLayout
      title='Dashboard'
      subTitle='Estadisticas generales'
      icon={ <DashboardOutlined /> }
    >
     <Grid container spacing={2}>
      <SummaryTitle 
        title={ numberOfOrders } 
        subTitle='Ordenes Totales' 
        icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }}/>}/>
      <SummaryTitle 
        title={ paidOrders } 
        subTitle='Ordenes Pagadas' 
        icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }}/>}/>
      <SummaryTitle 
      title={ notPaidOrders } 
      subTitle='Ordenes Pendientes' 
      icon={<CreditCardOffOutlined color='error' sx={{ fontSize: 40 }}/>}/>
      <SummaryTitle 
      title={ number0fClients } 
      subTitle='Clientes' 
      icon={<GroupAddOutlined color='primary' sx={{ fontSize: 40 }}/>}/>
      <SummaryTitle 
      title={ numberOfProducts } 
      subTitle='Productos' 
      icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }}/>}/>
      <SummaryTitle 
      title={ productosWithNoInventory } 
      subTitle='Sin Existencias' 
      icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }}/>}/>
      <SummaryTitle 
      title={ lowInventory } 
      subTitle='Bajo Inventario' 
      icon={<ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }}/>}/>
      <SummaryTitle 
      title={ refreshIn } 
      subTitle='Actualizacion en:' 
      icon={<AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }}/>}/>
     </Grid>
    </AdminLayout>
  )
}

export default DashboarPage