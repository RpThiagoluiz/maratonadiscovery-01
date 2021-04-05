const takeModal = document.querySelector(".modal-overlay");

const modal = {
  toggle() {
    takeModal.classList.toggle("active");
  },
  // open() {
  //   //abrir modal,
  //   //adc a class active do modal
  //   takeModal.classList.add("active");
  // },
  // close() {
  //   //fechar modal,
  //   //remover a class active do modal
  //   takeModal.classList.remove("active");
  // },
};

//dados retornados da APi  nao vou precisar mais porq eu vou buscar diretamente do localstorage.
// const transationArray = [
//   { id: 1, description: "luz", amount: -50015, date: "23/11/2201" },
//   { id: 2, description: "website", amount: 500050, date: "03/01/2201" },
//   { id: 3, description: "burger", amount: -20025, date: "12/12/2201" },
//   { id: 4, description: "Bento", amount: -10000, date: "12/12/2201" },
//   { id: 5, description: "Cura", amount: 200000, date: "12/12/2201" },
//   { id: 6, description: "Tonhao", amount: -150000, date: "12/12/2201" },
// ];

//pega eles e colocar dentro de cada lugar.

const storage = {
  get() {
    return JSON.parse(localStorage.getItem("@dev-finance-rocketseat")) || []; //se nao existir a informacao ele vai trazer um array vazio
  },
  set(transactions) {
    localStorage.setItem(
      "@dev-finance-rocketseat",
      JSON.stringify(transactions)
    );
  },
};

const transaction = {
  allTransaction: storage.get(), //imutabilidade

  add(element) {
    transaction.allTransaction.push(element);
    app.reload();
  },

  remove(index) {
    transaction.allTransaction.splice(index, 1); //pegar o elemento e remove, o segundo parametro do splice é a quantidade.
    app.reload();
  },

  incomes() {
    //somar entradas
    let income = 0;
    //pegar todas as transaction
    //para cada transacao
    transaction.allTransaction.forEach((transaction) => {
      //se ela for maior que zero
      if (transaction.amount > 0) {
        //somar a uma variavel e retornar a variavel
        income += transaction.amount;
      }
    });

    return income;
  },

  expenses() {
    //somar saidas
    let expense = 0;

    transaction.allTransaction.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });

    return expense;
  },

  total() {
    //total = entradas - saidas

    return transaction.incomes() + transaction.expenses();
  },
};

//map

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),

  addTransaction(transaction, index) {
    //console.log(transaction);
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;
    //console.log(tr);

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {
    const cssClass = transaction.amount > 0 ? "income" : "expense";

    const formatedAmount = utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${cssClass}">${formatedAmount}</td>
      <td class="date">${transaction.date}</td>
      <td><img onclick="transaction.remove(${index})"  src="/assets/minus.svg" alt="Remover Transação" /></td>
    `;

    return html;
  },

  updateBalance() {
    document.querySelector("#incomesDisplay").innerHTML = utils.formatCurrency(
      transaction.incomes()
    );
    document.querySelector("#expensesDisplay").innerHTML = utils.formatCurrency(
      transaction.expenses()
    );
    document.querySelector("#totalDisplay").innerHTML = utils.formatCurrency(
      transaction.total()
    );
  },

  clearTransactions() {
    DOM.transactionsContainer.innerHTML = "";
  },
};

const utils = {
  formatAmount(value) {
    //tirar e substituir caracteres que vierem do form.
    //usar a regex se precisar. value = Number(value.replace(/\,?\.?/g, "")) * 100
    //input ja vem do tipo number, por causa do seu type
    value = value * 100;
    return Math.round(value);
  },

  formatDate(date) {
    const splittedDate = date.split("-");
    //lembra que o splic ele separa uma string, e para separar ele precisa de um parametro em string.
    //splice retorna um array.
    // reverter o array, so aq vc ja traz a respsota como string novamente.
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  },

  formatCurrency(value) {
    //Separando o simbolo do valor passado.
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, ""); //regex e ela ta tirando oq nao for numero.
    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return signal + value;
  },
};

const form = {
  description: document.querySelector("#description"),
  amount: document.querySelector("#amount"),
  date: document.querySelector("#date"),

  getValues() {
    return {
      description: form.description.value,
      amount: form.amount.value,
      date: form.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = form.getValues();
    //.trim() faz limpeza dos espacos vazios
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por Favor Preencha todos os campos!");
      //Jogar o erro no console. agora vc precisa pegar ele e tratas ele
    }
  },

  formatValues() {
    let { description, amount, date } = form.getValues();

    amount = utils.formatAmount(amount);

    date = utils.formatDate(date);

    return {
      description,
      amount,
      date,
    };
  },

  clearFields() {
    form.description.value = "";
    form.amount.value = "";
    form.date.value = "";
  },

  submit(event) {
    event.preventDefault();
    //verificar se todas as informacoes foram preenchidas
    try {
      form.validateFields();
      //formatar os dados para salvar e salvar em uma variavel
      const transactionForm = form.formatValues();
      //salvar os dados no array.
      transaction.add(transactionForm);
      //apagar os dados do formulario
      form.clearFields();
      //modal feche
      modal.toggle();
      //atualizar a aplicacao
      //Ja tem app.reload(); no add.
    } catch (error) {
      alert(error.message); // alert
      //tem como fazer um novo modal ou trocar o conteudo dele pra error.
    }
  },
};

const app = {
  init() {
    transaction.allTransaction.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    // transaction.allTransaction.forEach(DOM.addTransaction);
    DOM.updateBalance(); // responsavel por inserir os dados trabalhados no js para o html
    storage.set(transaction.allTransaction);
  },
  reload() {
    DOM.clearTransactions();
    storage.set(transaction.allTransaction);
    app.init();
    //useEffect, sempre que vc quiser recarregar o app so chamar
  },
};

app.init();
