'use strict';
angular.module('orderRequest').factory('tableView', function() {
    var table = {
        orderBy: [],
        reverse: false,
        filterBy: "",
        filterText: "",
        filterObject: this.filterText,
        onClickRow: function(row) { //this gets overridden
            this.clearSelectedRow(); //clear selected rows
            console.log(row);
        },
        setOnClickRow: function(newOnClickRow) {
            this.onClickRow = function(row) {
                for (var i = 0; i < this.rows.length; i++) {
                    this.rows[i].isSelected = false;
                } //clear selected rows
                row.isSelected = true;
                newOnClickRow(row);
            }

        },
        updateFilterObject: function() {
            var filterBy = this.filterBy;
            var filterText = this.filterText;

            if (!filterBy) {
                this.filterObject = this.filterText
                return;
            }
            if (filterText.length === 0) {
                this.filterObject = this.filterText
                return;
            }
            this.filterObject = {};
            this.filterObject[filterBy] = filterText;
        },
        sortBy: function(column) {
            if (!column.sortBy) {
                column.sortBy = "ascending";
                this.orderBy.push(column.name); //column now sorted
            } else { //column was being sorted --> 
                if (column.sortBy === "descending") {
                    var orderByColumnName = "-" + column.name,
                        indexOfColumn = this.orderBy.indexOf(orderByColumnName);
                    this.orderBy.splice(indexOfColumn, 1);
                    column.sortBy = null;
                } else {
                    var indexOfColumn = this.orderBy.indexOf(column.name);
                    this.orderBy[indexOfColumn] = "-" + column.name;
                    column.sortBy = "descending";
                }
            }
        },
        isAscending: function(column) {
            if (column.sortBy === "ascending") {
                return true;
            } else {
                return false;
            }
        },
        isDescending: function(column) {
            if (column.sortBy === "descending") {
                return true;
            } else {
                return false;
            }
        },
        setRows: function(rows) {
            this.rows = rows;
        },
        setColumns: function(columns) {
            this.columns = columns;
        }
    };

    var tableView = {};
    tableView.createTable = function(tableSettings) {
        tableView[tableSettings.name] = Object.create(table);
        tableView[tableSettings.name].columns = tableSettings.columns;
        tableView[tableSettings.name].rows = (tableSettings.rows) ? tableSettings.rows : {};
        if (tableSettings.onClickRow) tableView[tableSettings.name].setOnClickRow(tableSettings.onClickRow);
    }

    return tableView;
});
