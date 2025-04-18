Component({
  data: {
    active: 0,
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
        icon: "home-o",
        selectedIcon: "home"
      },
      {
        pagePath: "pages/function/function",
        text: "功能",
        icon: "apps-o",
        selectedIcon: "apps"
      }
    ]
  },

  methods: {
    onChange(event) {
      console.log('onChange called with event:', event);
      const { index } = event.detail;
      console.log('Selected index:', index);
      
      const item = this.data.list[index];
      console.log('Selected item:', item);
      
      if (item && item.pagePath) {
        console.log('Attempting to navigate to:', item.pagePath);
        wx.reLaunch({
          url: '/' + item.pagePath,
          success: () => {
            console.log('Navigation success');
            this.setData({ active: index });
          },
          fail: (err) => {
            console.error('Navigation failed:', err);
            // 如果reLaunch失败，尝试使用navigateTo
            wx.navigateTo({
              url: '/' + item.pagePath,
              success: () => {
                console.log('Navigation success with navigateTo');
                this.setData({ active: index });
              },
              fail: (err) => {
                console.error('Navigation failed with navigateTo:', err);
              }
            });
          }
        });
      } else {
        console.error('Invalid item or pagePath:', item);
      }
    },

    init() {
      const page = getCurrentPages().pop();
      console.log('Current page:', page);
      
      if (page) {
        const route = page.route;
        console.log('Current route:', route);
        
        const active = this.data.list.findIndex(item => item.pagePath === route);
        console.log('Found active index:', active);
        
        if (active !== -1) {
          this.setData({ active });
        }
      }
    }
  },

  lifetimes: {
    attached() {
      this.init();
    }
  }
}); 