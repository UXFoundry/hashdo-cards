var HumanName = require('humanname')
var Moment = require('moment')
var MySQL = require('mysql')
var _ = require('lodash')

exports.isTime = function(dateTimeStamp) {
  if (dateTimeStamp) {
    return Moment().subtract(4, 'h') > Moment(dateTimeStamp)
  }

  return true
}

function shortenUserName(name) {
  if (name) {
    var parsed = HumanName.parse(name)

    if (parsed) {
      return `${parsed.initials || parsed.firstName.substr(0, 1)} ${parsed.lastName}`
    } else {
      return name
    }
  } else {
    return name
  }
}

exports.getStatement = function(accountNumber, clubDBServer, clubDBUser, clubDBPassword, clubDB, callback) {
  var connection = MySQL.createConnection({
    host: clubDBServer,
    user: clubDBUser,
    password: clubDBPassword,
    database: clubDB,
    multipleStatements: true
  })

  // queries
  var memberQuery = 'select MemberSalutation, MemberFirstname, MemberLastname from member where MemberNumber = ?'
  var balanceQuery = 'SELECT accountid, creditlimit, balance, (creditlimit + balance) as availablebalance, ownerdbid From spendingaccount Where accountid = ?'
  var transactionsQuery =
    "SELECT spendingacc_entry.AE_DATE AS Date, spendingacc_entry.AE_DT as 'Debit', spendingacc_entry.AE_CT as 'Credit', " +
    "spendingacc_entry.AE_DESCRIPTION as 'Description', spendingacc_entry.DOC_ID as 'Reference' FROM spendingacc_entry " +
    'where acc_id = ? and Month(ae_date) = month(current_date) and Year(ae_date) = year(current_date) order by ae_date DESC LIMIT 5'
  var query = memberQuery + '; ' + balanceQuery + '; ' + transactionsQuery

  connection.connect()

  connection.query(query, [accountNumber, accountNumber, accountNumber], function(err, results, fields) {
    if (err) {
      callback(err)
    } else {
      if (results && results.length === 3) {
        var result = {
          accountNumber: accountNumber,
          name: shortenUserName(results[0][0].MemberSalutation + ' ' + results[0][0].MemberFirstname + ' ' + results[0][0].MemberLastname),
          creditLimit: results[1][0].creditlimit,
          balance: results[1][0].balance,
          availableBalance: results[1][0].availablebalance,
          transactions: []
        }

        for (var i = 0; i < results[2].length; i++) {
          result.transactions.push({
            date: Moment(new Date(results[2][i].Date)).format('DD MMM YYYY'),
            debit: results[2][i].Debit,
            credit: results[2][i].Credit,
            description: results[2][i].Description,
            reference: results[2][i].Reference
          })
        }

        callback(null, result)
      } else {
        callback('Invalid MECC API response')
      }
    }
  })

  connection.end()
}
