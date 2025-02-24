# Projeto de Web Scraper com Puppeteer

## Visão Geral

Este projeto é um web scraper desenvolvido com **NestJS** e **Puppeteer**. Ele é projetado para extrair dados de produtos de websites e armazená-los em cache para otimizar o desempenho.

## Tecnologias Utilizadas

- **NestJS**: Um framework para construir aplicações Node.js escaláveis e eficientes. Escolhi o NestJS por sua arquitetura modular e suporte a TypeScript, o que facilita a manutenção e escalabilidade do projeto. Além de ser a framework que é utilizada pela Pelando.
- **Puppeteer**: Uma biblioteca Node que fornece uma API de alto nível para controlar o Chrome ou Chromium. Puppeteer é ideal para web scraping devido à sua capacidade de renderizar páginas da web de forma precisa e interagir com elas como um usuário real. Além de ter vários plugins para burlar captchas e outras proteções.
- **TypeScript**: Um superconjunto de JavaScript que adiciona tipagem estática. Utilizei TypeScript para melhorar a qualidade do código e reduzir erros durante o desenvolvimento.
- **Docker**: Utilizado para criar contêineres que garantem que a aplicação funcione de maneira consistente em diferentes ambientes. Docker facilita o processo de deployment e a gestão de dependências.

## Decisões de Negócio

- **Uso de Cache**: Implementei um serviço de cache para armazenar os resultados do scraping. Isso reduz a carga nos servidores de origem e melhora o tempo de resposta para os usuários.
- **Arquitetura Modular**: A arquitetura modular do NestJS permite que diferentes partes da aplicação sejam desenvolvidas e mantidas de forma independente, facilitando a adição de novas funcionalidades no futuro.
- **Contêinerização com Docker**: Utilizar Docker garante que a aplicação seja executada de forma consistente em qualquer ambiente, simplificando o processo de desenvolvimento, teste e deployment.
- **Príncipios SOLID**: Segui os princípios SOLID para garantir que o código seja fácil de entender, manter e estender. Isso inclui a separação de responsabilidades, injeção de dependências e outras práticas recomendadas.
- **Factory Pattern**: Utilizei o padrão de projeto Factory para criar instâncias de classes de scraping de forma dinâmica. Isso permite adicionar novos scrapers sem modificar o código existente.
- **Testes Automatizados**: Implementei testes automatizados para garantir que o código funcione conforme o esperado e para facilitar a manutenção no futuro.
- **Strategy Pattern**: Utilizei o padrão de projeto Strategy para definir diferentes estratégias de scraping de acordo com o DNS do website. Isso permite adaptar o comportamento do scraper de acordo com as necessidades específicas de cada site.

## Passos para Build e Up do Serviço

### Pré-requisitos

- Docker e Docker Compose instalados na máquina.

### Build do Serviço

1. Clone o repositório:
    ```sh
    git clone https://github.com/matheusaugm/multi-purpose-scraper.git multi-purpose-scraper
    cd multi-purpose-scraper
    ```

2. Construa a imagem Docker:
    ```sh
    docker-compose build
    ```

### Up do Serviço

1. Inicie os contêineres:
    ```sh
    docker-compose up
    ```

2. A aplicação estará disponível em `http://localhost:3000`.

### Variáveis de Ambiente

Certifique-se de configurar as seguintes variáveis de ambiente no `docker-compose.yml`:

- `PUPPETEER_DOCKER=true`: Indica que o Puppeteer está sendo executado em um ambiente Docker.
- `MAX_HTML_SIZE=1000000`: Define o tamanho máximo do HTML a ser processado.

## Contribuição

Sinta-se à vontade para abrir issues e pull requests. Agradeço muito o feedback!

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.