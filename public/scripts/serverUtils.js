const serverUtils = {
  async getFetching(url, headersOption) {
    let response = await fetch(url, {
      method: 'get',
      headers: headersOption,
    });

    if (!response.ok) return null;
    let data = response;

    if (headersOption['Content-Type'] == 'application/json') {
      data = await response.json();
    }

    return data;
  },

  // 스크랩 함수
  async getScraping(url, type) {
    if (type == null) {
      console.error('Type error');
      return null;
    }
    const fullURL = '/files/scraping/?url=' + url + '&type=' + type;
    let response = await this.getFetching(fullURL, {
      'Content-Type': 'application/json',
    });
    return response;
  },

  // 폴더 내부의 파일들을 받아오는 함수 (기본 경로는 app.js기준)
  async getFiles(dir) {
    const fullDir = `/files/dir?dir=${dir}`;
    let response = await this.getFetching(fullDir, {
      'Content-Type': 'application/json',
    });
    return response;
  },

  // 단일 파일을 받아오는 함수
  async getFile(dir, fileName) {
    const fullDir = `/files/file?dir=${dir}&fileName=${fileName}`;
    let response = await this.getFetching(fullDir, {
      'Content-Type': 'application/json',
    });
    return response;
  },
};
