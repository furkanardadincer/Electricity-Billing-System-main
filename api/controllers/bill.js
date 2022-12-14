const mongoose = require('mongoose');
const Bill = require('../models/bill');

exports.getAllBills = (req, res, next) => {
    Bill
        .find()
        .select('_id userId month issueDate paymentDate dueDate zoneName unitsConsumed billAmount status')
        .exec()
        .then(bills => {
            res.status(200).json({
                count: bills.length,
                bills: bills
            });
        })
        .catch(error => {
            next(error);
        })
};

exports.createOneBill = (req, res, next) => {

    console.log("Creating Bill...")
    return new Bill({
        _id: mongoose.Types.ObjectId(),
        userId: req.body.userId,
        zoneName: req.body.zoneName,
        unitsConsumed: req.body.unitsConsumed,
        billAmount: req.body.billAmount,
        status: req.body.status,
        month: req.body.month
    })
    .save()
    .then(result => {
        res.status(200).json({
            bill: result
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

};

exports.getBillByStatus = (req, res, next) => {
    const status = req.params.status;
    Bill
        .find({status: status})
        .select('_id userId month issueDate paymentDate dueDate zoneName unitsConsumed billAmount status')
        .exec()
        .then(bill => {
            return res.status(201).json(bill);
        })
        .catch(error => {
            next(error);
        });
};

exports.getBillByUserId = (req, res, next) => {
    const userId = req.params.userId;
    Bill
        .find({userId: userId})
        .select('_id userId month issueDate paymentDate dueDate zoneName unitsConsumed billAmount status')
        .exec()
        .then(bills => {
            return res.status(201).json({
              count: bills.length,
              bills: bills
            });
        })
        .catch(error => {
            next(error);
        });
};

exports.getBillPaidByUserId = (req, res, next) => {
    const userId = req.params.userId;
    Bill
        .find({$and: [ {userId: userId}, {status: "??dendi"} ]})
        .select('_id userId month issueDate paymentDate dueDate zoneName unitsConsumed billAmount status')
        .exec()
        .then(bills => {
            return res.status(201).json({
              count: bills.length,
              bills: bills
            });
        })
        .catch(error => {
            next(error);
        });
};


exports.updateOneBill = (req, res, next) => {
    const billId = req.params.billId;
    Bill
        .update({ _id: billId }, { $set: req.body })
        .exec()
        .then(result => {
            return res.status(200).json({
                message: 'Updated Bill Successfully!',
                result: result
            });
        })
        .catch(error => {
            next(error);
        });
};
