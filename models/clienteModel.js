const { client } = require("../config/db");

class Cliente {
    constructor(id, id_estado, id_cidade, nome, contato, logradouro, endereco, numberEnde, dataNasc, tipo, processo_id) {
        this.id = id;
        this.id_estado = id_estado;
        this.id_cidade = id_cidade;
        this.nome = nome;
        this.contato = contato;
        this.logradouro = logradouro;
        this.endereco = endereco;
        this.numberEnde = numberEnde;
        this.dataNasc = dataNasc;
        this.tipo = tipo;
        this.processo_id = processo_id;
    }

    static async listarTodos() {
        try {
            const results = await client.query("SELECT * FROM clientes");
            return results.rows;
        } catch (error) {
            return false;
        }
    }

    static async listarTodosVinculados(id) {
        try {
            const results = await client.query("SELECT clientes.* FROM clientes join vinculoac on clientes.id = vinculoac.id_cliente where vinculoac.id_advogado = $1", [id]);
            return results.rows;
        } catch (error) {
            return false;
        }
    }

    static async obterPorId(id) {
        try {
            const result = await client.query("SELECT * FROM clientes WHERE id = $1", [id]);
            return result.rows[0];
        } catch (error) {
            return false;
        }
    }

    static async criar(novoCliente) {
        novoCliente.contato = novoCliente.contato == '' ? null : parseInt(novoCliente.contato)
        
        const { advogado_id, nome, contato, cpf, data_nasc, sexo, logradouro, endereco, cep, numberEnde, complemento, cidade, bairro, emial, new_senha } = novoCliente;
        
        try {
            const result = await client.query(
                "INSERT INTO public.clientes (nome, cpf, data_nasc, sexo, emial, cep, bairro, complemento, cidade, contato, logradouro, endereco, senha, numberende) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
                [nome, cpf, data_nasc, sexo, emial, cep, bairro, complemento, cidade, contato, logradouro, endereco, new_senha, numberEnde]
            );
            
            await client.query(
                "INSERT INTO public.vinculoac (id_advogado, id_cliente) VALUES ($1, $2) RETURNING *",
                [advogado_id, result.rows[0].id]
            );

            return result.rows[0];
        } catch (error) {
            return false;
        }
    }

    static async atualizar(id, dadosAtualizados) {
        dadosAtualizados.cep = dadosAtualizados.cep ? dadosAtualizados.cep : null
        console.log(dadosAtualizados)
        const { nome, cpf, data_nasc, sexo, emial, cep, bairro, complemento, cidade, contato, logradouro, endereco, senha, numberEnde } = dadosAtualizados;
        try {
            await client.query(
                "UPDATE public.clientes SET nome= $2, cpf= $3, data_nasc= $4, sexo= $5, emial= $6, cep= $7, bairro= $8, complemento= $9, cidade= $10, contato= $11, logradouro= $12, endereco= $13, senha= $14, numberende= $15 WHERE id= $1",
                [id, nome, cpf, data_nasc, sexo, emial, cep, bairro, complemento, cidade, contato, logradouro, endereco, senha, numberEnde]
            );
            return true
        } catch (error) {
            return false
        }
    }

    static async excluir(id) {
        try {
            return await client.query("DELETE FROM clientes WHERE id = $1 RETURNING *", [id]);
        } catch (error) {
            return false
        }
    }

    static async authLogin(cpf, senha) {
        try {
            const result = await client.query('SELECT * FROM clientes WHERE cpf like $1 AND senha like $2', [cpf, senha]);

            if (result.rows.length > 0) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch (error) {
            return false;
        }
    }
}

module.exports = Cliente;



