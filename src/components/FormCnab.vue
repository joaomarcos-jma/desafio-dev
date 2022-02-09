<template>
  <div>
    <form class="form">
      <h3>Movimentação Financeira</h3>
      <div class="file-field">
        <label for="file">Escolha o Arquivo CNAB</label>
        <input id="file" type="file" @change="onFileChange" />
        <strong>{{fileName}}</strong>
      </div>
      <div class="action">
        <button @click.prevent="sendFile">Enviar</button>
      </div>
      <div v-if="reportData.length">
        <table class="center">
          <thead>
            <tr>
              <th v-for="(column, h) of headers" :key="h">{{column}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, i) of reportData" :key="i">
              <td class="cell-spacing">{{file.transaction_type | displayLabelTransaction}}</td>
              <td class="cell-spacing">{{file.document | cpfOrCnpj}}</td>
              <td class="cell-spacing">{{file.store_name}}</td>
              <td class="cell-spacing">{{file.store_owner}}</td>
              <td class="cell-spacing">{{file.card_token}}</td>
              <td class="cell-spacing">{{file.date | displayDate}}</td>
              <td class="cell-spacing">{{file.amount | currency}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </form>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  name: 'FormCnab',
  data: () => ({
    fileData: [],
    fileName: '',
    headers: [
      'TIPO_TRANSAÇÃO',
      'CPF',
      'NOME_LOJA',
      'DONO_LOJA',
      'CARTAO',
      'DATA_OPERAÇÂO',
      'VALOR',
    ],
  }),
  computed: {
    reportData() {
      return this.$store.getters?.reportData;
    },
  },
  methods: {
    onFileChange(val) {
      const file = val.target.files[0];
      this.fileName = file.name;
      if (['text/csv', 'text/plain'].includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const { result } = e.target;
          this.fileData = this.buildDocumentParsed(result);
        };
        reader.readAsText(file);
      }
    },
    parseAmount(value) {
      return Number((value / 100).toFixed(2));
    },
    formatDate(date, hour) {
      const dateParsed = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(
        6,
        8,
      )} ${hour.slice(0, 2)}:${hour.slice(2, 4)}:${hour.slice(4, 6)}`;
      const dateFormat = moment(String(dateParsed))
        .utc()
        .format();
      return dateFormat;
    },
    buildDocumentParsed(doc) {
      const lines = doc.split('\n');
      const parsedValues = [];
      lines.forEach((res) => {
        const body = {
          transaction_type: res.slice(0, 1),
          amount: this.parseAmount(res.slice(9, 19)),
          document: res.slice(19, 30),
          card_token: res.slice(30, 42),
          date: this.formatDate(res.slice(1, 9), res.slice(42, 48)),
          store_owner: res.slice(48, 62),
          store_name: res.slice(62, 81),
        };
        parsedValues.push(body);
      });
      return parsedValues;
    },
    sendFile() {
      if (this.fileData.length) {
        this.$store.dispatch('reportFile', this.fileData);
      }
    },
  },
};
</script>

<style scoped lang="scss">
h3 {
  margin-bottom: 15px;
  padding: 10px;
}

table,
th,
td {
  border: 1px solid black;
}

.cell-spacing {
  padding-left: 5px;
  padding-right: 5px;
}

input[type="file"] {
  display: none;
}
.file-field label {
  margin-top: 10px;
  background-color: #db3474;
  color: #fff;
  margin: 20px;
  padding: 6px 20px;
  cursor: pointer;
}
.action {
  min-width: 60px !important;
  padding: 4px;
}
.action > * {
  margin: 35px;
}
.action button {
  background: #2196f3;
  color: white;
  width: 100px;
  height: 40px;
  border: none;
  outline: none;
  box-shadow: 0 6px 18px -5px rgba(0, 0, 0, 0.2);
  font-size: 18px;
  border-radius: 40px;
  cursor: pointer;
}

.form {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  padding: 16px;
  text-align: center;
  background-color: #f1f1f1;
}

.center {
  margin-left: auto;
  margin-right: auto;
}
</style>
