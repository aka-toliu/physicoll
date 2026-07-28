# Icon component
Componente de icone SVG customizado.

### 1. Importar o componente
Importe o componente no local onde deseja utilizar

~~~typescript
import { IconComponent } from '../icon/icon.component';

// restante do component
imports: [ IconComponent ],
// restante do component
~~~

### 2. Adicione o SVG ao projeto
Adicione seus arquivos SVG de icones no caminho:
```
\public\assets\icons
```

### 3. Inserir ``IconComponent`` no template
Adicione o component no template

~~~html
<app-icon />
~~~

### 4. Propriedades obrigatórias

A propriedade ``icon`` é obrigatória. Insira o mesmo nome do arquivo SVG.

~~~html
<app-icon [icon]="user"/>
~~~

### 5. Opções de customização

#### **Tamanho**
Para customizar o tamanho do icone, adicione a propriedade ``size``, com o valor desejado. O tamanho do ícone é calculado em pixels.

Exemplo:
~~~html
<app-icon [icon]="user" [size]="24"/>
~~~

Outra forma de customizar o tamanho do ícone, é definir o valor da varíavel ``--size-icon`` de css dentro do escopo do icone.

Exemplo:
~~~css
.custom-class{
    ::ng-deep{
        app-icon i[icon]{
            --size-icon: 1rem;
        }
    }
}
~~~

#### **Cor**
Para customizar o tamanho do icone, adicione a propriedade ``colorVar``, com o valor de uma variável CSS existente no seu projeto. Ou utilize ``colorHex`` para utilizar uma cor customizada em hexadecimal

Exemplo 1:
~~~html
<app-icon [icon]="user" [colorVar]="--primary-color"/>
~~~

Exemplo 2:
~~~html
<app-icon [icon]="user" [colorHex]="#D1D1D1"/>
~~~

Outra forma de customizar o tamanho do ícone, é definir o valor da varíavel ``--color-icon`` de CSS dentro do escopo do icone.

Exemplo 1:
~~~css
.custom-class{
    ::ng-deep{
        app-icon i[icon]{
            --color-icon: var(--primary-color);
        }
    }
}
~~~

Exemplo 2:
~~~css
.custom-class{
    ::ng-deep{
        app-icon i[icon]{
            --color-icon: #A1A1A1;
        }
    }
}
~~~