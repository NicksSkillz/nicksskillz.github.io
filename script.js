$(document).ready(function() {
  $('#loading').show();
  $.getJSON('data/leaderboard.json', function(data) {
    let tableData = [];
    for (let track in data) {
      for (let car in data[track]) {
        data[track][car].forEach(entry => {
          let laptimeMs = entry.laptime;
          let minutes = Math.floor(laptimeMs / 60000);
          let seconds = Math.floor((laptimeMs % 60000) / 1000);
          let milliseconds = laptimeMs % 1000;
          let formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
          tableData.push([
            `<a href="#" class="filter-link" data-type="track" data-value="${track}">${track}</a>`,
            `<a href="#" class="filter-link" data-type="car" data-value="${car}">${car}</a>`,
            `<a href="#" class="filter-link" data-type="driver" data-value="${entry.name}">${entry.name}</a>`,
            formattedTime,
            entry.laps
          ]);
        });
      }
    }

    // Initialize DataTable
    $('#leaderboard').DataTable({
      data: tableData,
      columns: [
        { title: 'Track' },
        { title: 'Car' },
        { title: 'Driver' },
        { title: 'Lap Time' },
        { title: 'Total Laps' }
      ],
      pageLength: 25,
      searching: true,
      ordering: true,
      order: [[0, 'asc']],
      deferRender: true,
      responsive: true
    });

    // Custom search
    $('#search').on('keyup', function() {
      $('#leaderboard').DataTable().search(this.value).draw();
    });

    // Reset filter
    $('#reset-filter').on('click', function() {
      $('#search').val('');
      $('#leaderboard').DataTable().search('').columns().search('').draw();
    });

    // Filter by clicking links
    $('#leaderboard').on('click', '.filter-link', function(e) {
      e.preventDefault();
      let type = $(this).data('type');
      let value = $(this).data('value');
      
      // Reset search
      $('#search').val('');
      
      // Filter table
      let columnIndex = type === 'track' ? 0 : type === 'car' ? 1 : 2;
      $('#leaderboard').DataTable().column(columnIndex).search(value).draw();

      // Modal view
      let filteredData = [];
      for (let track in data) {
        for (let car in data[track]) {
          data[track][car].forEach(entry => {
            if (
              (type === 'track' && track === value) ||
              (type === 'car' && car === value) ||
              (type === 'driver' && entry.name === value)
            ) {
              let laptimeMs = entry.laptime;
              let minutes = Math.floor(laptimeMs / 60000);
              let seconds = Math.floor((laptimeMs % 60000) / 1000);
              let milliseconds = laptimeMs % 1000;
              let formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
              filteredData.push([track, car, entry.name, formattedTime, entry.laps]);
            }
          });
        }
      }
      
      // Initialize modal table
      $('#modal-title').text(`${type.charAt(0).toUpperCase() + type.slice(1)}: ${value}`);
      $('#modal-table').DataTable().destroy();
      $('#modal-table').DataTable({
        data: filteredData,
        columns: [
          { title: 'Track' },
          { title: 'Car' },
          { title: 'Driver' },
          { title: 'Lap Time' },
          { title: 'Total Laps' }
        ],
        pageLength: 10
      });
      
      // Show modal
      $('#modal-overlay, #detail-modal').show();
    });

    // Close modal
    $('#close-modal').on('click', function() {
      $('#modal-overlay, #detail-modal').hide();
    });

    $('#loading').hide();
  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.error('Error loading JSON:', textStatus, errorThrown);
    $('#loading').hide();
    $('#leaderboard-body').html('<tr><td colspan="5">Failed to load leaderboard data. Please check the JSON file.</td></tr>');
  });
});