$(document).ready(function() {
  // Fetch JSON data
  $.getJSON('data/leaderboard.json', function(data) {
    let rows = '';
    // Iterate through tracks
    for (let track in data) {
      // Iterate through cars
      for (let car in data[track]) {
        // Iterate through array of entries for this car
        data[track][car].forEach(entry => {
          // Convert laptime from milliseconds to MM:SS.mmm format
          let laptimeMs = entry.laptime;
          let minutes = Math.floor(laptimeMs / 60000);
          let seconds = Math.floor((laptimeMs % 60000) / 1000);
          let milliseconds = laptimeMs % 1000;
          let formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
          
          rows += `
            <tr>
              <td>${track}</td>
              <td>${car}</td>
              <td>${entry.name}</td>
              <td>${formattedTime}</td>
              <td>${entry.laps}</td>
            </tr>
          `;
        });
      }
    }
    // Append rows to table body
    $('#leaderboard-body').html(rows);

    // Initialize DataTables
    $('#leaderboard').DataTable({
      pageLength: 25,
      searching: true,
      ordering: true,
      order: [[0, 'asc']] // Default sort by track
    });

    // Custom search input
    $('#search').on('keyup', function() {
      $('#leaderboard').DataTable().search(this.value).draw();
    });
  }).fail(function(jqXHR, textStatus, errorThrown) {
    console.error('Error loading JSON:', textStatus, errorThrown);
    $('#leaderboard-body').html('<tr><td colspan="5">Failed to load leaderboard data. Please check the JSON file.</td></tr>');
  });
});