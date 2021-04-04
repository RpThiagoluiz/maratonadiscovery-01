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

//dados retornados da APi
const transationArray = [
  { id: 1, description: "luz", amount: -50015, date: "23/11/2201" },
  { id: 2, description: "website", amount: 500050, date: "03/01/2201" },
  { id: 3, description: "burger", amount: -20025, date: "12/12/2201" },
  { id: 4, description: "Bento", amount: -10000, date: "12/12/2201" },
  { id: 5, description: "Cura", amount: 200000, date: "12/12/2201" },
  { id: 6, description: "Tonhao", amount: -150000, date: "12/12/2201" },
];

//pega eles e colocar dentro de cada lugar.

const transaction = {
  allTransaction: [...transationArray], //imutabilidade

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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);
    //console.log(tr);

    DOM.transactionsContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction) {
    const cssClass = transaction.amount > 0 ? "income" : "expense";

    const formatedAmount = utils.formatCurrency(transaction.amount);

    const html = `
      <td class="description">${transaction.description}</td>
      <td class="${cssClass}">${formatedAmount}</td>
      <td class="date">${transaction.date}</td>
      <td><img src="/assets/minus.svg" alt="Remover Transação" /></td>
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

const app = {
  init() {
    transaction.allTransaction.forEach((transaction) => {
      DOM.addTransaction(transaction);
    });

    DOM.updateBalance(); // responsavel por inserir os dados trabalhados no js para o html
  },
  reload() {
    DOM.clearTransactions();
    app.init();
    //useEffect, sempre que vc quiser recarregar o app so chamar
  },
};

app.init();

transaction.add({
  id: 88,
  description: "TestBravoAlfa!",
  amount: 500000,
  date: "12/12/2201",
});
