# Proyecto para mostrar un tablero de mensajes.

### *Ejemplo:*
<div style="display:grid;grid-template-columns:1fr 1fr auto auto; align-items:center; background-color:black; border-radius:10px;padding:20px;" >
    <span>
        <img style="border-radius:50%" src="https://img.freepik.com/vector-premium/mono-cabeza-simple-estilo-plano-ilustracion-vector-animal-forma-duo-fauna-africana-naturaleza-ico_497088-77.jpg" width="70"  alt="Avatar">
        <h3>John Doe</h3>
        <h4>Publicado: 23/12/2024 - 10:43</h4>
    </span>
    <section style="font-family:Georgia; display:flex;flex-direction:column;"><p><i>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit quis, magni dignissimos laborum sint dolorum molestias, error eius placeat natus accusamus unde earum! Animi neque voluptas rem, in at ipsum.</i></p>
            <button style="padding:5px; margin:auto">Editar</button>
    </section>
</div>

***

### Cuestiones principales:
<ol>
    <li>El usuario debe registrarse y al hacerlo le llegara una template via mail aceptando la autenticacion 
    <ul>
        <li><b>Herramientas:</b> <i>Nodemailer - JWT - CookieParser</i></li>
    </ul>
    </li>
    <li>Se realizaran las operaciones <b>CRUD</b> en cada mensaje</li>
    <li>Deberia poderse filtrar por <b>Categorias</b> de cada mensaje</li>
    <li>Se dispondra una base embebida de tipo <b>SQL (Sqlite)</b> realizando cada operación con Sequelize</li>
    <li>Implementar logica de capas: <b>controllers,repository,services, models y routes</b></li>
    <li>Aplicar <b>React</b> para realizar las Peticiones a las <b>APIS</b></li>
    <li>Documentar todo mediante <b>Swagger</b></li>

</ol>

***

### Tiempo estimado de realizacion:

- Máximo: 2 días
- Fecha de inicio: `dd - mm - aaaa`
- Fecha de finalización: `dd-mm-aaaa`   

***
### Modelos:

<table style="background-color:darkgray; color:black; border-radius:5px;">
<tr><b><h3>Usuario:</h3></b></tr>
    <tr>
        <th>Atributo</th>
        <th>Tipo</th>
        <th>Relaciones</th>
    </tr>
    <tr>
        <td>id_user</td>
        <td>INT PRIMARY KEY AUTO_INCREMENT</td>
        <td>Uno a muchos <b>(Mensajes)</b></td>
    </tr>
    <tr>
        <td>username</td>
        <td>VARCHAR(15) NOT NULL UNIQUE</td>
    </tr>
    <tr>
        <td>name</td>
        <td>VAR(10) NOT NULL</td>
    </tr>
    <tr>
        <td>lastname</td>
        <td>VAR(10) NOT NULL</td>
    </tr>
    <tr>
        <td>password</td>
        <td>VARCHAR(30) NOT NULL</td>
    </tr>
    <tr>
        <td>avatar</td>
        <td>VARCHAR(70) NOT NULL DEFAULT <:imagen:></td>
    </tr>
    <tr>
        <td>lastname</td>
        <td>VAR(10) NOT NULL</td>
    </tr>
    <tr>
        <td>timestamp</td>
        <td>DATE NOT NULL DEFAULT NOW()</td>
    </tr>
</table>
<br>
<table style="background-color:darkgray; color:black; border-radius:5px;">
<tr><b><h3>Mensaje:</h3></b></tr>
    <tr>
        <th>Atributo</th>
        <th>Tipo</th>
        <th>Relaciones</th>
    </tr>
    <tr>
        <td>id_mensaje</td>
        <td>INT PRIMARY KEY AUTO_INCREMENT</td>
        <td>Muchos a uno <b>(Usuarios)</b></td>
    </tr>
    <tr>
        <td>cuerpo</td>
        <td>VARCHAR(144) NOT NULL</td>
    </tr>
    <tr>
        <td>categorias</td>
        <td>INT NOT NULL</td>
    </tr>
    <tr>
        <td>timestamp</td>
        <td>DATE NOT NULL</td>
    </tr>
</table>
<br>
<table style="background-color:darkgray; color:black; border-radius:5px;">
<tr><b><h3>Categorias:</h3></b></tr>
    <tr>
        <th>Atributo</th>
        <th>Tipo</th>
        <th>Relaciones</th>
    </tr>
    <tr>
        <td>id_categoria</td>
        <td>INT PRIMARY KEY AUTO_INCREMENT</td>
        <td>Muchos a uno <b>(Mensajes)</b></td>
    </tr>
    <tr>
        <td>categoria</td>
        <td>VARCHAR(15) NOT NULL</td>
    </tr>
    <tr>
        <td>timestamp</td>
        <td>DATE NOT NULL</td>
    </tr>
</table>