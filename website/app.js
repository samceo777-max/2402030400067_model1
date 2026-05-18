/* ═══════════════════════════════════════
   DevCircle — app.js
   jQuery-powered Developer Social Network
═══════════════════════════════════════ */

$(function () {

    /* ════════════════════════════════════
       STATE
    ════════════════════════════════════ */
    const state = {
      currentPage: 'feed',
      currentUser: {
        id: 'u0',
        name: 'Alex Dev',
        handle: '@devuser',
        bio: 'Full-stack wizard · Open source enthusiast · Coffee-driven development ☕',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devuser',
        stack: ['JavaScript', 'Rust', 'DevOps'],
        followers: 128,
        following: 64
      },
      following: new Set(['u1', 'u3']),
      likedPosts: new Set(),
      activePostId: null,
      selectedTag: 'javascript',
      prevPage: 'feed',
      viewingUser: null,
      theme: 'dark',
      accent: '#00ff88'
    };
  
    /* ════════════════════════════════════
       SEED DATA
    ════════════════════════════════════ */
    const users = [
      { id: 'u1', name: 'Priya Sharma', handle: '@priyacode', bio: 'React fanatic · building dev tools · chai > coffee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya', stack: ['React', 'TypeScript', 'Go'], followers: 342, following: 89 },
      { id: 'u2', name: 'Marcus Wright', handle: '@mwdev', bio: 'Systems programmer · Rust evangelist · OSS contributor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus', stack: ['Rust', 'C++', 'Linux'], followers: 218, following: 47 },
      { id: 'u3', name: 'Yuki Tanaka', handle: '@yukibuilds', bio: 'ML engineer by day · game dev by night · 🎮', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=yuki', stack: ['Python', 'PyTorch', 'Unity'], followers: 507, following: 162 },
      { id: 'u4', name: 'Lena Müller', handle: '@lenadev', bio: 'Backend architect · PostgreSQL nerd · distributed systems', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lena', stack: ['Go', 'Postgres', 'Kafka'], followers: 191, following: 73 },
      { id: 'u5', name: 'Dev Patel', handle: '@devpatelx', bio: 'DevOps engineer · k8s enthusiast · cloud cost optimizer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devpatel', stack: ['K8s', 'Terraform', 'AWS'], followers: 285, following: 130 }
    ];
  
    const posts = [
      { id: 'p1', userId: 'u1', content: 'Just shipped a custom React hook for real-time websocket subscriptions. Zero re-renders on unchanged keys. DM me if you want the gist!', tag: 'javascript', likes: 47, time: '2h ago', comments: [{ author: 'Marcus Wright', text: 'Would love to see the gist!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus' }] },
      { id: 'p2', userId: 'u2', content: "Rust's borrow checker just saved me from a nasty race condition that would've taken days to debug in C++. Once you get it — it clicks. Trust the compiler. 🦀", tag: 'rust', likes: 89, time: '4h ago', comments: [] },
      { id: 'p3', userId: 'u3', content: 'Fine-tuned a small LLM to generate Unity shader code. Results are surprisingly good for procedural terrain. Paper dropping next week 🚀', tag: 'python', likes: 134, time: '6h ago', comments: [{ author: 'Priya Sharma', text: 'Cannot wait for the paper!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya' }, { author: 'Alex Dev', text: 'This is wild!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devuser' }] },
      { id: 'p4', userId: 'u4', content: 'Hot take: most "microservices" architectures are just distributed monoliths with extra latency. Start with a modular monolith and split only when you have real scale reasons.', tag: 'devops', likes: 211, time: '8h ago', comments: [] },
      { id: 'p5', userId: 'u5', content: 'Cut our AWS bill by 40% this quarter with Karpenter + spot instances + right-sizing. The ROI on a proper k8s cost audit is insane. Thread below 👇', tag: 'devops', likes: 156, time: '1d ago', comments: [{ author: 'Lena Müller', text: 'We did something similar with GKE, massive savings!', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lena' }] },
      { id: 'p6', userId: 'u1', content: 'CSS has evolved so much. Grid subgrid, container queries, :has(), @layer — we can build complex layouts that previously needed JavaScript. Embrace the cascade 🎨', tag: 'css', likes: 73, time: '1d ago', comments: [] }
    ];
  
    const notifications = [
      { id: 'n1', type: 'like', icon: '❤️', user: 'Priya Sharma', action: 'liked your post', detail: '"Just shipped a custom React hook..."', time: '15m ago', unread: true },
      { id: 'n2', type: 'follow', icon: '✅', user: 'Marcus Wright', action: 'started following you', detail: '', time: '1h ago', unread: true },
      { id: 'n3', type: 'comment', icon: '💬', user: 'Yuki Tanaka', action: 'commented on your post', detail: '"This is wild!"', time: '3h ago', unread: true },
      { id: 'n4', type: 'like', icon: '❤️', user: 'Dev Patel', action: 'liked your post', detail: '"CSS has evolved so much..."', time: '5h ago', unread: false },
      { id: 'n5', type: 'follow', icon: '✅', user: 'Lena Müller', action: 'started following you', detail: '', time: '1d ago', unread: false }
    ];
  
    const trendingTags = [
      { tag: '#javascript', count: '1.2k posts' },
      { tag: '#rust', count: '847 posts' },
      { tag: '#python', count: '2.1k posts' },
      { tag: '#devops', count: '634 posts' },
      { tag: '#css', count: '512 posts' },
      { tag: '#typescript', count: '1.8k posts' },
      { tag: '#react', count: '1.4k posts' },
      { tag: '#go', count: '423 posts' },
      { tag: '#linux', count: '389 posts' },
      { tag: '#kubernetes', count: '298 posts' }
    ];
  
    /* ════════════════════════════════════
       RENDER HELPERS
    ════════════════════════════════════ */
    function getUserById(id) {
      if (id === 'u0') return state.currentUser;
      return users.find(u => u.id === id) || null;
    }
  
    function timeAgo() {
      const times = ['just now', '1m ago', '5m ago', '12m ago'];
      return times[Math.floor(Math.random() * times.length)];
    }
  
    function renderPost(post, container, prepend = false) {
      const user = getUserById(post.userId);
      if (!user) return;
      const liked = state.likedPosts.has(post.id);
      const isOwn = post.userId === 'u0';
  
      const html = `
        <div class="post-card" data-post-id="${post.id}">
          <div class="post-header">
            <img src="${user.avatar}" class="user-avatar-sm" />
            <div class="post-author">
              <div class="post-author-name" data-user-id="${user.id}">${user.name}</div>
              <div class="post-author-handle">${user.handle}</div>
            </div>
            <span class="post-time">${post.time}</span>
          </div>
          <div class="post-content">${post.content}</div>
          <span class="post-tag">#${post.tag}</span>
          <div class="post-actions">
            <button class="action-btn btn-like ${liked ? 'liked' : ''}" data-post-id="${post.id}">
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              <span class="like-count">${post.likes}</span>
            </button>
            <button class="action-btn btn-comment" data-post-id="${post.id}">
              <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
              <span>${post.comments.length}</span>
            </button>
            <button class="action-btn btn-share" data-post-id="${post.id}">
              <svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share
            </button>
            ${isOwn ? `<button class="action-btn btn-delete-post" data-post-id="${post.id}" style="margin-left:auto;color:var(--red)">
              <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              Delete
            </button>` : ''}
          </div>
        </div>`;
  
      if (prepend) $(container).prepend(html);
      else $(container).append(html);
    }
  
    function renderDevCard(user, container) {
      const isFollowing = state.following.has(user.id);
      const tagsHtml = user.stack.map(t => `<span class="tag" style="font-size:0.65rem">${t}</span>`).join('');
      const html = `
        <div class="dev-card" data-user-id="${user.id}">
          <img src="${user.avatar}" class="user-avatar-sm" />
          <div class="dev-card-info">
            <div class="dev-card-name">${user.name}</div>
            <div class="dev-card-handle">${user.handle}</div>
            <div class="dev-card-tags">${tagsHtml}</div>
          </div>
          <button class="btn-follow-sm ${isFollowing ? 'following' : ''}" data-user-id="${user.id}">
            ${isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>`;
      $(container).append(html);
    }
  
    /* ════════════════════════════════════
       PAGE RENDERING
    ════════════════════════════════════ */
    function renderFeed() {
      const $c = $('#posts-container').empty();
      posts.forEach(p => renderPost(p, $c));
      updateProfileStats();
    }
  
    function renderExplore(filter = '') {
      // Tag cloud
      const $cloud = $('#tag-cloud').empty();
      trendingTags.forEach(t => {
        $cloud.append(`<div class="cloud-tag" data-tag="${t.tag}">${t.tag} <span style="opacity:0.5;font-size:0.68rem">${t.count}</span></div>`);
      });
  
      // Devs
      const $devs = $('#explore-users').empty();
      const filtered = filter
        ? users.filter(u => u.name.toLowerCase().includes(filter) || u.handle.toLowerCase().includes(filter) || u.stack.some(s => s.toLowerCase().includes(filter)))
        : users;
      filtered.forEach(u => renderDevCard(u, $devs));
      if (filtered.length === 0) $devs.html('<div class="empty-state"><div class="empty-icon">🔍</div><p>No developers found</p></div>');
  
      // Posts
      const $ep = $('#explore-posts-container').empty();
      const filteredPosts = filter
        ? posts.filter(p => p.content.toLowerCase().includes(filter) || p.tag.includes(filter))
        : [...posts].sort((a, b) => b.likes - a.likes).slice(0, 4);
      filteredPosts.forEach(p => renderPost(p, $ep));
      if (filteredPosts.length === 0) $ep.html('<div class="empty-state"><div class="empty-icon">📭</div><p>No posts found</p></div>');
    }
  
    function renderNotifications() {
      const $c = $('#notif-container').empty();
      notifications.forEach((n, i) => {
        const html = `
          <div class="notif-item ${n.unread ? 'unread' : ''}" style="animation-delay:${i * 0.05}s">
            <div class="notif-icon ${n.type}">${n.icon}</div>
            <div class="notif-body">
              <div class="notif-text"><strong>${n.user}</strong> ${n.action} ${n.detail ? `<em style="color:var(--text3)">${n.detail}</em>` : ''}</div>
              <div class="notif-time">${n.time}</div>
            </div>
          </div>`;
        $c.append(html);
      });
      $('#notif-badge').text('0').hide();
    }
  
    function renderProfile() {
      const u = state.currentUser;
      $('#profile-name').text(u.name);
      $('#profile-handle').text(u.handle);
      $('#profile-bio').text(u.bio);
      $('#profile-avatar').attr('src', u.avatar);
      const tagsHtml = u.stack.map(t => `<span class="tag">${t}</span>`).join('');
      $('#profile-tags').html(tagsHtml);
      updateProfileStats();
  
      // My posts
      const $mp = $('#my-posts-container').empty();
      const myPosts = posts.filter(p => p.userId === 'u0');
      if (myPosts.length === 0) {
        $mp.html('<div class="empty-state"><div class="empty-icon">✍️</div><p>No posts yet. Share something!</p></div>');
      } else {
        myPosts.forEach(p => renderPost(p, $mp));
      }
  
      // Liked posts
      const $lk = $('#liked-container').empty();
      const likedPosts = posts.filter(p => state.likedPosts.has(p.id));
      if (likedPosts.length === 0) {
        $lk.html('<div class="empty-state"><div class="empty-icon">🤍</div><p>No liked posts yet</p></div>');
      } else {
        likedPosts.forEach(p => renderPost(p, $lk));
      }
    }
  
    function updateProfileStats() {
      const myPosts = posts.filter(p => p.userId === 'u0').length;
      const totalLikes = posts.filter(p => p.userId === 'u0').reduce((s, p) => s + p.likes, 0);
      $('#stat-posts').text(myPosts);
      $('#stat-followers').text(state.currentUser.followers);
      $('#stat-following').text(state.currentUser.following);
      $('#acc-posts').text(myPosts);
      $('#acc-likes').text(totalLikes);
    }
  
    function renderUserProfile(userId) {
      const user = getUserById(userId);
      if (!user) return;
      state.viewingUser = user;
  
      $('#uprofile-name').text(user.name);
      $('#uprofile-handle').text(user.handle);
      $('#uprofile-bio').text(user.bio);
      $('#uprofile-avatar').attr('src', user.avatar);
  
      const tagsHtml = user.stack.map(t => `<span class="tag">${t}</span>`).join('');
      $('#uprofile-tags').html(tagsHtml);
  
      const userPosts = posts.filter(p => p.userId === userId);
      $('#ustat-posts').text(userPosts.length);
      $('#ustat-followers').text(user.followers);
      $('#ustat-following').text(user.following);
  
      const isFollowing = state.following.has(userId);
      $('#btn-follow-user').toggleClass('following', isFollowing).text(isFollowing ? 'Following' : 'Follow');
  
      const $up = $('#uprofile-posts').empty();
      if (userPosts.length === 0) {
        $up.html('<div class="empty-state"><div class="empty-icon">📭</div><p>No posts yet</p></div>');
      } else {
        userPosts.forEach(p => renderPost(p, $up));
      }
    }
  
    function renderComments(postId) {
      const post = posts.find(p => p.id === postId);
      if (!post) return;
      state.activePostId = postId;
      const $list = $('#comments-list').empty();
      if (post.comments.length === 0) {
        $list.html('<div class="empty-state" style="padding:1.5rem"><div class="empty-icon">💬</div><p>Be the first to comment</p></div>');
      } else {
        post.comments.forEach((c, i) => {
          $list.append(`
            <div class="comment-item" style="animation-delay:${i * 0.06}s">
              <img src="${c.avatar}" class="user-avatar-sm" />
              <div class="comment-body">
                <div class="comment-author">${c.author}</div>
                <div class="comment-text">${c.text}</div>
              </div>
            </div>`);
        });
      }
      $('#modal-overlay').removeClass('hidden');
    }
  
    /* ════════════════════════════════════
       NAVIGATION
    ════════════════════════════════════ */
    function navigateTo(page, extra) {
      state.prevPage = state.currentPage;
      state.currentPage = page;
  
      $('.page').addClass('hidden');
      $(`#page-${page}`).removeClass('hidden');
  
      $('.nav-item').removeClass('active');
      $(`.nav-item[data-page="${page}"]`).addClass('active');
  
      if (page === 'feed') renderFeed();
      else if (page === 'explore') renderExplore();
      else if (page === 'notifications') renderNotifications();
      else if (page === 'profile') renderProfile();
      else if (page === 'user-profile' && extra) renderUserProfile(extra);
  
      // Close mobile sidebar
      $('#sidebar').removeClass('open');
      window.scrollTo(0, 0);
    }
  
    /* ════════════════════════════════════
       EVENTS — Navigation
    ════════════════════════════════════ */
    $(document).on('click', '.nav-item', function (e) {
      e.preventDefault();
      navigateTo($(this).data('page'));
    });
  
    $('#sidebar-user').on('click', () => navigateTo('profile'));
  
    $('#btn-back').on('click', () => navigateTo(state.prevPage || 'feed'));
  
    $('#hamburger').on('click', () => $('#sidebar').toggleClass('open'));
  
    $(document).on('click', function (e) {
      if ($('#sidebar').hasClass('open') && !$(e.target).closest('#sidebar, #hamburger').length) {
        $('#sidebar').removeClass('open');
      }
    });
  
    /* ════════════════════════════════════
       EVENTS — Post Author Click
    ════════════════════════════════════ */
    $(document).on('click', '.post-author-name', function () {
      const uid = $(this).data('user-id');
      if (uid === 'u0') { navigateTo('profile'); return; }
      navigateTo('user-profile', uid);
    });
  
    $(document).on('click', '.dev-card', function () {
      const uid = $(this).data('user-id');
      navigateTo('user-profile', uid);
    });
  
    /* ════════════════════════════════════
       EVENTS — Create Post
    ════════════════════════════════════ */
    $('.tag-btn').on('click', function () {
      $('.tag-btn').removeClass('active');
      $(this).addClass('active');
      state.selectedTag = $(this).data('tag');
    });
  
    $('#btn-post').on('click', function () {
      const content = $('#post-input').val().trim();
      if (!content) { showToast('Write something first! ✍️'); return; }
  
      const newPost = {
        id: 'p_' + Date.now(),
        userId: 'u0',
        content,
        tag: state.selectedTag,
        likes: 0,
        time: 'just now',
        comments: []
      };
      posts.unshift(newPost);
      renderPost(newPost, '#posts-container', true);
      $('#post-input').val('');
      updateProfileStats();
      showToast('Post published! 🚀');
    });
  
    /* ════════════════════════════════════
       EVENTS — Like
    ════════════════════════════════════ */
    $(document).on('click', '.btn-like', function () {
      const postId = $(this).data('post-id');
      const post = posts.find(p => p.id === postId);
      if (!post) return;
  
      const $btn = $(this);
      if (state.likedPosts.has(postId)) {
        state.likedPosts.delete(postId);
        post.likes--;
        $btn.removeClass('liked');
      } else {
        state.likedPosts.add(postId);
        post.likes++;
        $btn.addClass('liked');
      }
      $btn.find('.like-count').text(post.likes);
      $btn.css('transform', 'scale(1.3)');
      setTimeout(() => $btn.css('transform', ''), 200);
    });
  
    /* ════════════════════════════════════
       EVENTS — Comment Modal
    ════════════════════════════════════ */
    $(document).on('click', '.btn-comment', function () {
      const postId = $(this).data('post-id');
      renderComments(postId);
    });
  
    $('#modal-close, #modal-overlay').on('click', function (e) {
      if (e.target === this) $('#modal-overlay').addClass('hidden');
    });
  
    $('#btn-comment').on('click', function () {
      const text = $('#comment-input').val().trim();
      if (!text) return;
      const post = posts.find(p => p.id === state.activePostId);
      if (!post) return;
  
      const comment = { author: state.currentUser.name, text, avatar: state.currentUser.avatar };
      post.comments.push(comment);
  
      const $list = $('#comments-list');
      if ($list.find('.empty-state').length) $list.empty();
      $list.append(`
        <div class="comment-item">
          <img src="${comment.avatar}" class="user-avatar-sm" />
          <div class="comment-body">
            <div class="comment-author">${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
          </div>
        </div>`);
  
      // Update comment count in all post cards
      $(`.btn-comment[data-post-id="${state.activePostId}"] span`).text(post.comments.length);
      $('#comment-input').val('');
      $('#comments-list').scrollTop(9999);
      showToast('Comment posted 💬');
    });
  
    $('#comment-input').on('keydown', function (e) {
      if (e.key === 'Enter') $('#btn-comment').click();
    });
  
    /* ════════════════════════════════════
       EVENTS — Share
    ════════════════════════════════════ */
    $(document).on('click', '.btn-share', function () {
      showToast('Link copied to clipboard! 🔗');
    });
  
    /* ════════════════════════════════════
       EVENTS — Delete Post
    ════════════════════════════════════ */
    $(document).on('click', '.btn-delete-post', function (e) {
      e.stopPropagation();
      const postId = $(this).data('post-id');
      const idx = posts.findIndex(p => p.id === postId);
      if (idx !== -1) posts.splice(idx, 1);
      $(this).closest('.post-card').fadeOut(250, function () { $(this).remove(); });
      updateProfileStats();
      showToast('Post deleted 🗑️');
    });
  
    /* ════════════════════════════════════
       EVENTS — Follow (Explore)
    ════════════════════════════════════ */
    $(document).on('click', '.btn-follow-sm', function (e) {
      e.stopPropagation();
      const uid = $(this).data('user-id');
      if (state.following.has(uid)) {
        state.following.delete(uid);
        $(this).removeClass('following').text('Follow');
        state.currentUser.following = Math.max(0, state.currentUser.following - 1);
        showToast('Unfollowed');
      } else {
        state.following.add(uid);
        $(this).addClass('following').text('Following');
        state.currentUser.following++;
        showToast('Now following! ✅');
      }
      updateProfileStats();
    });
  
    /* ════════════════════════════════════
       EVENTS — Follow (User Profile)
    ════════════════════════════════════ */
    $('#btn-follow-user').on('click', function () {
      const uid = state.viewingUser?.id;
      if (!uid) return;
      if (state.following.has(uid)) {
        state.following.delete(uid);
        state.currentUser.following = Math.max(0, state.currentUser.following - 1);
        $(this).removeClass('following').text('Follow');
        showToast('Unfollowed');
      } else {
        state.following.add(uid);
        state.currentUser.following++;
        $(this).addClass('following').text('Following');
        showToast('Now following! ✅');
      }
      updateProfileStats();
    });
  
    /* ════════════════════════════════════
       EVENTS — Profile Tabs
    ════════════════════════════════════ */
    $(document).on('click', '.ptab', function () {
      $('.ptab').removeClass('active');
      $(this).addClass('active');
      const tab = $(this).data('tab');
      if (tab === 'my-posts') {
        $('#my-posts-container').removeClass('hidden');
        $('#liked-container').addClass('hidden');
      } else {
        $('#my-posts-container').addClass('hidden');
        $('#liked-container').removeClass('hidden');
      }
    });
  
    /* ════════════════════════════════════
       EVENTS — Search (Explore)
    ════════════════════════════════════ */
    let searchTimeout;
    $('#search-input').on('input', function () {
      clearTimeout(searchTimeout);
      const q = $(this).val().toLowerCase().trim();
      searchTimeout = setTimeout(() => renderExplore(q), 300);
    });
  
    /* ════════════════════════════════════
       EVENTS — Tag Cloud Click
    ════════════════════════════════════ */
    $(document).on('click', '.cloud-tag', function () {
      const tag = $(this).data('tag').replace('#', '');
      $('#search-input').val(tag);
      renderExplore(tag);
    });
  
    /* ════════════════════════════════════
       EVENTS — Settings
    ════════════════════════════════════ */
    // Save Profile
    $('#btn-save-profile').on('click', function () {
      state.currentUser.name = $('#set-name').val().trim() || state.currentUser.name;
      state.currentUser.handle = $('#set-handle').val().trim() || state.currentUser.handle;
      state.currentUser.bio = $('#set-bio').val().trim() || state.currentUser.bio;
      state.currentUser.stack = $('#set-stack').val().split(',').map(s => s.trim()).filter(Boolean);
  
      $('#sidebar-user .sidebar-username').text(state.currentUser.handle);
      showToast('Profile saved! ✅');
    });
  
    // Theme
    $(document).on('click', '.theme-btn', function () {
      $('.theme-btn').removeClass('active');
      $(this).addClass('active');
      state.theme = $(this).data('theme');
      $('html').attr('data-theme', state.theme);
      showToast(`Theme: ${state.theme} 🎨`);
    });
  
    // Accent
    $(document).on('click', '.accent-swatch', function () {
      $('.accent-swatch').removeClass('active');
      $(this).addClass('active');
      const color = $(this).data('color');
      const dim = color + '22';
      document.documentElement.style.setProperty('--accent', color);
      document.documentElement.style.setProperty('--accent-dim', dim);
      document.documentElement.style.setProperty('--accent-glow', `0 0 20px ${color}44`);
      showToast('Accent updated ✨');
    });
  
    /* ════════════════════════════════════
       EVENTS — Edit Profile button
    ════════════════════════════════════ */
    $('#btn-edit-profile').on('click', () => navigateTo('settings'));
  
    /* ════════════════════════════════════
       TOAST
    ════════════════════════════════════ */
    function showToast(msg) {
      const $t = $('#toast').removeClass('hidden').addClass('show').text(msg);
      setTimeout(() => {
        $t.removeClass('show');
        setTimeout(() => $t.addClass('hidden'), 350);
      }, 2500);
    }
  
    /* ════════════════════════════════════
       AUTH
    ════════════════════════════════════ */
  
    // Demo accounts
    const accounts = [
      { username: 'devuser', email: 'dev@dev.com', password: 'dev123', name: 'Alex Dev', handle: '@devuser', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=devuser' },
      { username: 'admin', email: 'admin@devcircle.com', password: 'admin123', name: 'Admin User', handle: '@admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin' }
    ];
    const signedUp = [];
    let selectedStack = [];
  
    function showApp() {
      $('#auth-screen').addClass('hidden');
      $('body').css('overflow', '');
      navigateTo('feed');
      setTimeout(() => {
        notifications.unshift({ id: 'n_live', type: 'like', icon: '❤️', user: 'Yuki Tanaka', action: 'liked your post', detail: '"Just posted"', time: 'just now', unread: true });
        const cur = parseInt($('#notif-badge').text()) || 0;
        $('#notif-badge').text(cur + 1).show();
        showToast('❤️ Yuki Tanaka liked your post');
      }, 8000);
    }
  
    function authError($el, msg) {
      $el.text(msg).removeClass('hidden');
      setTimeout(() => $el.addClass('hidden'), 4000);
    }
  
    // Tab switch
    $('#tab-login').on('click', function () {
      $('#tab-login').addClass('active'); $('#tab-signup').removeClass('active');
      $('#login-form').removeClass('hidden'); $('#signup-form').addClass('hidden');
    });
    $('#tab-signup').on('click', function () {
      $('#tab-signup').addClass('active'); $('#tab-login').removeClass('active');
      $('#signup-form').removeClass('hidden'); $('#login-form').addClass('hidden');
    });
  
    // Toggle password visibility
    $(document).on('click', '.toggle-pw', function () {
      const $inp = $(`#${$(this).data('target')}`);
      $inp.attr('type', $inp.attr('type') === 'password' ? 'text' : 'password');
      $(this).find('svg').css('opacity', $inp.attr('type') === 'text' ? '1' : '0.5');
    });
  
    // Stack chips
    $(document).on('click', '.stack-chip', function () {
      const val = $(this).data('val');
      if ($(this).hasClass('selected')) {
        selectedStack = selectedStack.filter(s => s !== val);
        $(this).removeClass('selected');
      } else if (selectedStack.length < 5) {
        selectedStack.push(val);
        $(this).addClass('selected');
      } else {
        showToast('Pick up to 5 technologies');
      }
    });
  
    // Handle hint validation
    $('#su-handle').on('input', function () {
      const val = $(this).val().replace(/[^a-z0-9_]/gi, '').toLowerCase();
      $(this).val(val ? '@' + val.replace(/^@+/, '') : '');
      const clean = val.replace(/^@+/, '');
      const $hint = $('#handle-hint');
      if (clean.length === 0) { $hint.text('').removeClass('ok err'); return; }
      if (clean.length < 3) { $hint.text('Too short (min 3 chars)').removeClass('ok').addClass('err'); return; }
      const taken = accounts.concat(signedUp).some(a => a.username === clean);
      if (taken) { $hint.text('Username taken').removeClass('ok').addClass('err'); }
      else { $hint.text('✓ Available').removeClass('err').addClass('ok'); }
    });
  
    // Password strength
    $('#su-pass').on('input', function () {
      const pw = $(this).val();
      let score = 0;
      if (pw.length >= 6) score++;
      if (pw.length >= 10) score++;
      if (/[A-Z]/.test(pw)) score++;
      if (/[0-9]/.test(pw)) score++;
      if (/[^a-zA-Z0-9]/.test(pw)) score++;
      const colors = ['#ff4757', '#ff4757', '#f59e0b', '#0ea5e9', '#00ff88', '#00ff88'];
      const widths = [0, 20, 40, 60, 80, 100];
      $('#pw-bar').css({ width: widths[score] + '%', background: colors[score] });
    });
  
    // LOGIN
    $('#login-form').on('submit', function (e) {
      e.preventDefault();
      const user = $('#login-user').val().trim().toLowerCase();
      const pass = $('#login-pass').val();
      if (!user || !pass) { authError($('#login-error'), '⚠ Please fill all fields'); return; }
  
      const found = accounts.concat(signedUp).find(a =>
        (a.username === user || a.email === user) && a.password === pass
      );
  
      if (!found) { authError($('#login-error'), '✕ Invalid credentials. Try devuser / dev123'); return; }
  
      // Update current user
      state.currentUser.name = found.name;
      state.currentUser.handle = found.handle;
      state.currentUser.avatar = found.avatar;
      $('#sidebar-user .sidebar-username').text(found.handle);
      $('#sidebar-user img').attr('src', found.avatar);
      $('#set-name').val(found.name);
      $('#set-handle').val(found.handle);
  
      const $btn = $('#btn-login').addClass('loading').find('span').text('Logging in...');
      setTimeout(showApp, 900);
    });
  
    // SIGNUP
    $('#signup-form').on('submit', function (e) {
      e.preventDefault();
      const fn = $('#su-firstname').val().trim();
      const ln = $('#su-lastname').val().trim();
      const handle = $('#su-handle').val().replace(/^@/, '').trim();
      const email = $('#su-email').val().trim();
      const pass = $('#su-pass').val();
  
      if (!fn || !ln || !handle || !email || !pass) {
        authError($('#signup-error'), '⚠ Please fill all required fields'); return;
      }
      if (handle.length < 3) { authError($('#signup-error'), '⚠ Username too short'); return; }
      if (pass.length < 6) { authError($('#signup-error'), '⚠ Password must be at least 6 characters'); return; }
  
      const taken = accounts.concat(signedUp).some(a => a.username === handle || a.email === email);
      if (taken) { authError($('#signup-error'), '✕ Username or email already exists'); return; }
  
      const newUser = {
        username: handle, email, password: pass,
        name: fn + ' ' + ln,
        handle: '@' + handle,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`
      };
      signedUp.push(newUser);
  
      // Apply to current user
      state.currentUser.name = newUser.name;
      state.currentUser.handle = newUser.handle;
      state.currentUser.avatar = newUser.avatar;
      state.currentUser.stack = selectedStack.length ? selectedStack : ['JavaScript'];
      $('#sidebar-user .sidebar-username').text(newUser.handle);
      $('#sidebar-user img').attr('src', newUser.avatar);
      $('#set-name').val(newUser.name);
      $('#set-handle').val(newUser.handle);
      $('#set-stack').val(state.currentUser.stack.join(', '));
  
      $('#btn-signup').addClass('loading').find('span').text('Creating account...');
      setTimeout(showApp, 1000);
    });
  
    // Social login (demo)
    $('#btn-github, #btn-google').on('click', function () {
      const name = $(this).attr('id') === 'btn-github' ? 'GitHub' : 'Google';
      $(this).text('Connecting...');
      setTimeout(() => {
        state.currentUser.name = name + ' User';
        state.currentUser.handle = '@' + name.toLowerCase() + 'user';
        showApp();
      }, 1200);
    });
  
    // Forgot password
    $('#forgot-link').on('click', function (e) {
      e.preventDefault();
      showToast('📧 Reset link sent to your email');
    });
  
    /* ════════════════════════════════════
       INIT
    ════════════════════════════════════ */
    // Show auth screen first — block body scroll
    $('body').css('overflow', 'hidden');
  
    // Auth screen shown; app loads after login
  });