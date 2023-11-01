var points = [-Infinity, Infinity];
var point_info = [-1, -1];

function InsertRow() {
    const table = $('.func-set')[0];
    const col_len = table.rows[0].cells.length;
    for(let i = 0; i < table.rows.length; i++) {
        var cell = document.createElement("td");
        if(i == 0) {
            if(col_len > 2) cell.innerHTML = `x<sup>${col_len - 1}</sup>`;
            else cell.innerText = 'x';
        }
        else {
            cell.setAttribute("contenteditable", "true");
            cell.innerText = '0';
        }
        table.rows[i].append(cell);
    }
}

function DeleteRow() {
    const table = $('.func-set')[0];
    const row_len = table.rows[0].cells.length;
    if(row_len > 2) {
        for(let i = 0; i < table.rows.length; i++)
            table.rows[i].deleteCell(-1);
    }
}

function InsertPoint() {
    let x = $('#insert')[0].innerText;
    const table = $('.func-set')[0];
    x = Number(x);
    if(x != NaN) {
        let idx, chk = 0;
        let start = ['[', '('], end = [')', ']'];
        for(idx = 0; idx < points.length; idx++) {
            if(points[idx] == x) chk = 1;
            if(points[idx] > x) break;
        }
        if(!chk) {
            const prev_row = table.rows[idx];
            const new_row = table.insertRow(idx + 1);
            const col_len = table.rows[0].cells.length;
            const tmp = $('input[name=point]:checked').val() == "right" ? 0 : 1;

            if(idx == 1) prev_row.cells[0].innerHTML = `(-∞, ${x}${end[tmp]}`;
            else prev_row.cells[0].innerHTML = `${start[point_info[idx - 1]]}${points[idx - 1]}, ${x}${end[tmp]}`;
            
            var new_cell = document.createElement("td");
            if(idx == points.length - 1) new_cell.innerHTML = `${start[tmp]}${x}, ∞)`;
            else new_cell.innerHTML = `${start[tmp]}${x}, ${points[idx]}${end[point_info[idx]]}`;

            points.splice(idx, 0, x);
            point_info.splice(idx, 0, tmp);
            new_cell.setAttribute("class", "front");
            new_row.append(new_cell);

            for(let j = 1; j < col_len; j++) {
                var cell = document.createElement("td");
                cell.setAttribute("contenteditable", "true");
                cell.innerText = '0';
                new_row.append(cell);
            }
        }
    }
}

function DeletePoint() {
    let x = $('#delete')[0].innerText;
    const table = $('.func-set')[0];
    x = Number(x);
    if(x != NaN) {
        let start = ['[', '('], end = [')', ']'];
        const idx = points.indexOf(x);
        if(idx != -1) {
            const prev_row = table.rows[idx];
            if(points.length == 3)
                prev_row.cells[0].innerHTML = `(-∞, ∞)`;
            else {
                if(idx == 1) prev_row.cells[0].innerHTML 
                = `(-∞, ${points[idx + 1]}${end[point_info[idx + 1]]}`;
                else if(idx == points.length - 2) prev_row.cells[0].innerHTML 
                = `${start[point_info[idx - 1]]}${points[idx - 1]}, ∞)`;
                else prev_row.cells[0].innerHTML 
                = `${start[point_info[idx - 1]]}${points[idx - 1]}, ${points[idx + 1]}${end[point_info[idx + 1]]}`;
            }
            table.deleteRow(idx + 1);
            points.splice(idx, 1);
            point_info.splice(idx, 1);
        }
    }
}

function IsFillWithNumber() {
    const table = $('.func-set')[0];
    let cnt = 0;
    for(let i = 1; i < table.rows.length; i++) {
        for(let j = 1; j < table.rows[i].cells.length; j++) {
            var num = table.rows[i].cells[j].innerText;
            if(isNaN(num)) cnt++;
        }
    }
    return cnt == 0;
}

function FunctionSum(i, x, n) {
    const table = $('.func-set')[0];
    var sum = 0, now_row = table.rows[i + 1];
    for(let j = 1; j < now_row.cells.length; j++) {
        var tmp = Number(now_row.cells[j].innerText);
        if(n == 0) sum += tmp * (j == 1 ? 1 : x ** (j - 1));
        if(n == 1 && j > 1) sum += (j - 1) * tmp * (j == 2 ? 1 : (x ** (j - 2)));
    }
    return sum;
}

function IsCanDifferentiate() {
    const check = $('input[name=check]:checked').val();
    if(check == "dot") IsCanDifferentiateDot();
    if(check == "range") IsCanDifferentiateRange();
}

function IsCanDifferentiateDot() {
    const result_dot = $('.result-dot')[0];
    const result_range = $('.result-range')[0];

    const x_val = $('#x-val')[0];
    const x_left = $('#x-left')[0];
    const x_right = $('#x-right')[0];
    const x_res = $('#x-res')[0];

    const dx_val = $('#dx-val')[0];
    const dx_left = $('#dx-left')[0];
    const dx_right = $('#dx-right')[0];
    const dx_res = $('#dx-res')[0];

    let x = $('#check')[0].innerText;
    x = Number(x);
    if(IsFillWithNumber()) {
        for(let i = 0; i < points.length - 1; i++) {
            if(points[i] < x && x < points[i + 1]) {
                var x_sum = FunctionSum(i, x, 0);
                var dx_sum = FunctionSum(i, x, 1);

                x_val.innerHTML = x_left.innerHTML = x_right.innerHTML = `${x_sum}`;
                dx_val.innerHTML = dx_left.innerHTML = dx_right.innerHTML = `${dx_sum}`;

                x_res.innerText = '연속';
                x_res.setAttribute("class", "yes");

                dx_res.innerText = '미분 가능';
                dx_res.setAttribute("class", "yes");
                break;
            }
            else if(points[i] == x) {
                var x_sum = [FunctionSum(i, x, 0), FunctionSum(i - 1, x, 0)];
                var dx_sum = [FunctionSum(i, x, 1), FunctionSum(i - 1, x, 1)];

                x_left.innerHTML = `${x_sum[1]}`;
                x_right.innerHTML = `${x_sum[0]}`;
                x_val.innerHTML = `${x_sum[point_info[i]]}`;
                dx_val.innerText = dx_left.innerText = dx_right.innerText = '-';

                if(x_sum[0] == x_sum[1]) {
                    if(dx_sum[0] == dx_sum[1]) {
                        dx_left.innerHTML = `${dx_sum[1]}`;
                        dx_right.innerHTML = `${dx_sum[0]}`;
                        dx_val.innerHTML = `${dx_sum[point_info[i]]}`;

                        x_res.innerText = '연속';
                        x_res.setAttribute("class", "yes");

                        dx_res.innerText = '미분 가능';
                        dx_res.setAttribute("class", "yes");
                    }
                    else {
                        dx_left.innerHTML = `${dx_sum[1]}`;
                        dx_right.innerHTML = `${dx_sum[0]}`;
                        dx_val.innerHTML = `-`;

                        x_res.innerText = '연속';
                        x_res.setAttribute("class", "yes");

                        dx_res.innerText = '미분 불가능';
                        dx_res.setAttribute("class", "no");
                    }
                }
                else {
                    x_res.innerText = '불연속';
                    x_res.setAttribute("class", "no");

                    dx_res.innerText = '미분 불가능';
                    dx_res.setAttribute("class", "no");
                }
                break;
            }
        }

        result_dot.setAttribute("style", "display: block;");
        result_range.setAttribute("style", "display: none;");
    }
}

function IsCanDifferentiateRange() {
    const result_dot = $('.result-dot')[0];
    const result_range = $('.result-range')[0];
    const detail = $('.result-range .detail tbody')[0];

    var new_row;
    detail.innerHTML = ``;
    if(IsFillWithNumber()) {
        for(let i = 0; i < points.length - 1; i++) {
            if(i > 0) {
                new_row = detail.insertRow();
                for(let i = 0; i < 5; i++) {
                    var cell = document.createElement("td");
                    new_row.append(cell);
                }

                x = points[i];
                var x_sum = [FunctionSum(i, x, 0), FunctionSum(i - 1, x, 0)];
                var dx_sum = [FunctionSum(i, x, 1), FunctionSum(i - 1, x, 1)];

                new_row.cells[0].setAttribute("class", "front");
                new_row.cells[0].innerHTML = `${points[i]}`;
                new_row.cells[1].innerHTML = `${x_sum[1]} / ${x_sum[0]}`;
                if(x_sum[0] == x_sum[1]) {
                    new_row.cells[2].innerHTML = `${dx_sum[1]} / ${dx_sum[0]}`;

                    new_row.cells[3].innerText = '연속';
                    new_row.cells[3].setAttribute("class", "yes");

                    if(dx_sum[0] == dx_sum[1]) {
                        new_row.cells[4].innerText = '미분 가능';
                        new_row.cells[4].setAttribute("class", "yes");
                    }
                    else {
                        new_row.cells[4].innerText = '미분 불가능';
                        new_row.cells[4].setAttribute("class", "no");
                    }
                }
                else {
                    new_row.cells[2].innerText = '-';

                    new_row.cells[3].innerText = '불연속';
                    new_row.cells[3].setAttribute("class", "no");

                    new_row.cells[4].innerText = '미분 불가능';
                    new_row.cells[4].setAttribute("class", "no");
                }
            }

            new_row = detail.insertRow();
            for(let i = 0; i < 5; i++) {
                var cell = document.createElement("td");
                new_row.append(cell);
            }

            new_row.cells[0].setAttribute("class", "front");
            if(points.length == 2) new_row.cells[0].innerHTML = `(-∞, ∞)`;
            else {
                if(i == 0) new_row.cells[0].innerHTML = `(-∞, ${points[i + 1]})`;
                else if(i == points.length - 2) new_row.cells[0].innerHTML = `(${points[i]}, ∞)`;
                else new_row.cells[0].innerHTML = `(${points[i]}, ${points[i + 1]})`;
            }

            new_row.cells[1].innerText = new_row.cells[2].innerText = '-';

            new_row.cells[3].innerText = '연속';
            new_row.cells[3].setAttribute("class", "yes");

            new_row.cells[4].innerText = '미분 가능';
            new_row.cells[4].setAttribute("class", "yes");
        }

        result_dot.setAttribute("style", "display: none;");
        result_range.setAttribute("style", "display: block;");
    }
}
