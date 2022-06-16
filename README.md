# Next.js Teslo Shop App

Para correr localmente, se necesita la base de datos

```
docker-compose up -d
```

- El -d significa **detached**

MongoDB URL Local:

````
mongodb://localhost:27017/teslodb
```

````

## Configurar las variables de entorno

Renombrar el archivo **.env.template** a **.env**

## Reconstruir los modulos de node

```
    yarn install
    yard dev
```

## Llenar la base de datos con informacion de pruebas

Llamar a:

```
http://localhost:3000/api/seed
```
