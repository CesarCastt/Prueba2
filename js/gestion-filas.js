class MiniTable {
    static _alert(msg) { alert(`MiniTable: ${msg}`); }

    static _colCount($table) {
      const $head = $table.find('thead th');
      return $head.length || $table.find('tr:first td').length;
    }

    static _idIndex($table) {
      const $ths = $table.find('thead th');
      if ($ths.length) {
        const idx = $ths.toArray().findIndex(el => $(el).text().trim().toLowerCase() === 'id');
        return idx !== -1 ? idx : 0;
      }
      return 0;
    }

    static agregarFila(data, tablaId) {
      try {
        const $table = $('#' + tablaId);
        if (!$table.length) return this._alert(`No existe la tabla #${tablaId}`);

        const props = Object.keys(data);
        const cols = this._colCount($table);

        if (cols !== props.length)
          return this._alert(`Propiedades (${props.length}) no coinciden con columnas (${cols})`);

        const $tr = $('<tr>');
        props.forEach(k => {
          if (k === 'cambiarEstado') {
            const $btn = $('<button>')
              .addClass('btn btn-warning btn-sm btn-cambiar-estado')
              .text('Cambiar');
            $tr.append($('<td>').append($btn));
          } else if (k === 'eliminar') {
            const id = data.id;
            const $btn = $('<button>')
              .addClass('btn btn-danger btn-sm btn-eliminar')
              .text('Eliminar')
              .click(() => this.eliminarFila(id, tablaId));
            $tr.append($('<td>').append($btn));
          } else {
            $tr.append($('<td>').text(data[k]));
          }
        });

        $table.find('tbody').append($tr);
      } catch (e) {
        this._alert(e.message);
      }
    }
    


    static eliminarFila(idValor, tablaId) {
      try {
        const $table = $('#' + tablaId);
        if (!$table.length) return this._alert(`No existe la tabla #${tablaId}`);
        const idx = this._idIndex($table);
        const $row = $table.find('tbody tr').filter((_, tr) =>
          $(tr).children().eq(idx).text() == idValor
        );
        if (!$row.length) return this._alert(`No se encontró fila con id = ${idValor}`);
        $row.remove();
      } catch (e) {
        this._alert(e.message);
      }
    }
  }
