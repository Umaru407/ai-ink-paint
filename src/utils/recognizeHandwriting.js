

const recognizeHandwriting = (size, strokes, maxResult = 10, callback) => {
    // console.log('recognizeHandwriting@@@',  strokes);
    const url = 'https://inputtools.google.com/request?ime=handwriting';
    const requestBody = {
      options: 'enable_pre_space',
      requests: [{
        writing_guide: {
          writing_area_width: size.width,
          writing_area_height: size.height
        },
        max_num_results: maxResult,
        max_completions: 10,
        language: 'zh-tw',
        ink: strokes
      }]
    };

    // console.log('requestBody', requestBody);
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
      const [status, result] = data;
      if (status === 'SUCCESS') {
        const [, possibleResult] = result[0];
        if (callback && typeof callback === 'function') {
          callback(possibleResult);
        }
      } else {
        callback([]);
      }
    })
    .catch((error) => {
      callback([]);
    });
  };

// const recognizeHandwriting = (size:any, strokes:Stroke, maxResult = 10, callback:any) => {
//   axios.post('https://inputtools.google.com/request?ime=handwriting', {
//     options: 'enable_pre_space',
//     requests: [{
//       writing_guide:
//       {
//         writing_area_width: size.width,
//         writing_area_height: size.height
//       },
//       max_num_results: maxResult,
//       max_completions:10,
//       language: 'zh-tw',
//       ink: strokes
//     }]
//   }).then(({ data }) => {
//     const [status, result] = data;
//     if (data[0] === 'SUCCESS') {
//       const [, possibleResult] = result[0];
//       if (callback && typeof callback === 'function') {
//         callback(possibleResult);
//       }
//     } else {
//       callback(`API error:${status}`);
//     }
//   }).catch((error) => {
//     callback(error);
//   });
// };

export default recognizeHandwriting;
