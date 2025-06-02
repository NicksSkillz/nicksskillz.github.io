$(document).ready(function() {
  // Fetch JSON data
  $.getJSON('data/MR_Leaderboard_no_GUIDs.json', function(data) {
    let rows = '';
    // Iterate through tracks and cars
    for (let track in data.tracks) {
      for (let car in data.tracks[track]) {
        let carData = data.tracks[track][car];
        // Iterate through laptimes
        carData.laptimes.forEach(laptime => {
          rows += `
            <tr>
              <td>${track}</td>
              <td>${car}</td>
              <td>${carData.driver}</td>
              <td>${laptime}</td>
              <td>${carData.totalLaps}</td>
            </tr>
          `;
        });
      }
    }
    // Append rows to table body
    $('#leaderboard-body').html(rows);

    // Initialize DataTables for sorting and searching
    $('#leaderboard').DataTable({
      pageLength: 10, // Show 10 rows per page
      searching: true,
      ordering: true,
      order: [[3, 'asc']] // Default sort by lap time
    });

    // Custom search input
    $('#search').on('keyup', function() {
      $('#leaderboard').DataTable().search(this.value).draw();
    });
  });
});