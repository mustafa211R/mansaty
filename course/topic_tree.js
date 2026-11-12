/* topic_tree.js — شجرة المواضيع لمنصة طالب
   - صفحة list.html: تبديل بين عرض الشبكة وعرض الشجرة (المادة ← الصف ← الوحدة ← الفصل/الكورس ← الدروس ← المصطلحات)
   - صفحة course.html: درج جانبي "شجرة المواضيع" للتنقل بين دروس الكورس وبقية فصول الوحدة */
(function () {
    'use strict';

    function DB() { return window.coursesDB; }
    function esc(t) { var d = document.createElement('div'); d.textContent = t == null ? '' : String(t); return d.innerHTML; }
    function prog(id) { try { return DB().getProgress(id); } catch (e) { return { completedLessons: [] }; } }

    /* ---------- بناء الهيكل: المادة ← الصف ← الوحدة ← [كورسات] ---------- */
    function buildTree(courses) {
        var root = {};
        courses.forEach(function (c) {
            var sub = c.subject || c.category || 'عام';
            var grade = c.grade || 'كورسات عامة';
            var unit = c.unitNo ? ('الوحدة ' + c.unitNo + ': ' + c.unitTitle) : '';
            root[sub] = root[sub] || {};
            root[sub][grade] = root[sub][grade] || {};
            root[sub][grade][unit] = root[sub][grade][unit] || [];
            root[sub][grade][unit].push(c);
        });
        return root;
    }

    function lessonLink(courseId, idx, title, done) {
        return '<li class="tt-lesson"><a href="course.html?courseId=' + courseId + '&lesson=' + (idx + 1) + '">' +
            '<span class="tt-dot ' + (done ? 'done' : '') + '">' + (done ? '✓' : (idx + 1)) + '</span>' + esc(title) + '</a></li>';
    }

    function courseNode(c, open, currentCourseId, currentLessons, currentIdx, completed) {
        var p = prog(c.id);
        var done = (p.completedLessons || []).length;
        var total = c.totalLessons || (c.topics || []).length || 0;
        var isCur = String(c.id) === String(currentCourseId);
        var label = c.chapterNo ? ('الفصل ' + c.chapterNo + ': ' + c.chapterTitle) : c.title;
        var html = '<details class="tt-node tt-course' + (isCur ? ' tt-current' : '') + '"' + (open || isCur ? ' open' : '') + '><summary>' +
            '<span class="tt-ic">📘</span><span class="tt-lbl">' + esc(label) + '</span>' +
            '<span class="tt-badge">' + done + '/' + total + '</span>' +
            (isCur ? '' : '<a class="tt-go" href="course.html?courseId=' + c.id + '" onclick="event.stopPropagation()">فتح</a>') +
            '</summary><ul class="tt-lessons">';
        if (isCur && currentLessons) {
            currentLessons.forEach(function (l, i) {
                var isDone = (completed || []).indexOf(l.id) !== -1;
                html += '<li class="tt-lesson' + (i === currentIdx ? ' active' : '') + '"><a href="#" data-go="' + i + '">' +
                    '<span class="tt-dot ' + (isDone ? 'done' : '') + '">' + (isDone ? '✓' : (i + 1)) + '</span>' + esc(l.title) + '</a></li>';
            });
        } else {
            (c.topics || []).forEach(function (t, i) {
                var items = (t.items || []).map(function (x) { return '<span class="tt-chip">' + esc(x) + '</span>'; }).join('');
                html += lessonLink(c.id, i, t.title, (p.completedLessons || []).indexOf(i + 1) !== -1) +
                    (items ? '<li class="tt-items">' + items + '</li>' : '');
            });
        }
        return html + '</ul></details>';
    }

    function renderTree(courses, opts) {
        opts = opts || {};
        var tree = buildTree(courses), html = '';
        Object.keys(tree).forEach(function (sub) {
            html += '<details class="tt-node tt-subject" open><summary><span class="tt-ic">📚</span><span class="tt-lbl">' + esc(sub) + '</span></summary><div class="tt-children">';
            Object.keys(tree[sub]).forEach(function (grade) {
                html += '<details class="tt-node tt-grade" open><summary><span class="tt-ic">🎓</span><span class="tt-lbl">الصف: ' + esc(grade) + '</span></summary><div class="tt-children">';
                var units = Object.keys(tree[sub][grade]).sort();
                units.forEach(function (unit) {
                    var cs = tree[sub][grade][unit].sort(function (a, b) { return a.id - b.id; });
                    var inner = cs.map(function (c) {
                        return courseNode(c, false, opts.currentCourseId, opts.lessons, opts.idx, opts.completed);
                    }).join('');
                    if (unit) {
                        html += '<details class="tt-node tt-unit" open><summary><span class="tt-ic">🗂️</span><span class="tt-lbl">' + esc(unit) + '</span></summary><div class="tt-children">' + inner + '</div></details>';
                    } else {
                        html += inner;
                    }
                });
                html += '</div></details>';
            });
            html += '</div></details>';
        });
        return html;
    }

    /* ---------- صفحة القائمة ---------- */
    function initList() {
        var grid = document.getElementById('coursesGrid');
        if (!grid || !DB()) return;
        var bar = document.querySelector('.filter-chip') && document.querySelector('.filter-chip').parentNode;
        var box = document.createElement('div');
        box.id = 'treeView'; box.className = 'tt-wrap'; box.style.display = 'none';
        grid.parentNode.appendChild(box);

        var btn = document.createElement('button');
        btn.className = 'filter-chip tt-toggle'; btn.type = 'button';
        btn.textContent = '🗂️ شجرة المواضيع';
        (bar || grid.parentNode).appendChild(btn);

        function draw() {
            box.innerHTML =
                '<div class="tt-tools"><button type="button" data-a="open">توسيع الكل</button><button type="button" data-a="close">طيّ الكل</button></div>' +
                renderTree(DB().courses);
        }
        box.addEventListener('click', function (e) {
            var a = e.target.getAttribute && e.target.getAttribute('data-a');
            if (!a) return;
            box.querySelectorAll('details').forEach(function (d) { d.open = (a === 'open'); });
        });
        btn.addEventListener('click', function () {
            var on = box.style.display === 'none';
            if (on) draw();
            box.style.display = on ? 'block' : 'none';
            grid.style.display = on ? 'none' : '';
            btn.classList.toggle('active', on);
            btn.textContent = on ? '▦ عرض البطاقات' : '🗂️ شجرة المواضيع';
        });
    }

    /* ---------- صفحة الكورس ---------- */
    var CourseTree = {
        init: function (app) {
            var self = this;
            this.app = app;
            var back = document.getElementById('backBtn');
            if (!back) return;

            var btn = document.createElement('button');
            btn.type = 'button'; btn.className = 'btn-secondary'; btn.id = 'treeBtn';
            btn.innerHTML = '<i class="fas fa-sitemap"></i> شجرة المواضيع';
            back.parentNode.insertBefore(btn, back);

            var veil = document.createElement('div'); veil.className = 'tt-veil';
            var dr = document.createElement('aside'); dr.className = 'tt-drawer'; dr.id = 'ttDrawer';
            document.body.appendChild(veil); document.body.appendChild(dr);

            function close() { dr.classList.remove('open'); veil.classList.remove('open'); }
            btn.addEventListener('click', function () { self.refresh(); dr.classList.add('open'); veil.classList.add('open'); });
            veil.addEventListener('click', close);
            dr.addEventListener('click', function (e) {
                if (e.target.id === 'ttClose') return close();
                var a = e.target.closest && e.target.closest('a[data-go]');
                if (a) { e.preventDefault(); self.go(parseInt(a.getAttribute('data-go'), 10)); close(); }
            });

            // تحديث عند تغيّر الدرس
            var orig = app.loadCurrentLesson;
            app.loadCurrentLesson = function () { orig.apply(app, arguments); self.refresh(); };

            // رابط مباشر إلى درس: course.html?courseId=12&lesson=3
            var n = parseInt(new URLSearchParams(location.search).get('lesson'), 10);
            if (n && n >= 1 && n <= app.lessons.length && n - 1 !== app.currentLessonIndex) this.go(n - 1);
            this.refresh();
        },

        go: function (i) {
            var a = this.app;
            if (!a.lessons[i]) return;
            a.currentLessonIndex = i;
            a.currentQuestions = []; a.currentQuestionIndex = 0; a.questionAnswers = {};
            try { a.saveProgress(false); } catch (e) { }
            a.loadCurrentLesson();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        refresh: function () {
            var a = this.app, dr = document.getElementById('ttDrawer');
            if (!a || !dr || !a.course) return;
            var c = a.course;
            var same = DB().courses.filter(function (x) {
                return c.subject ? (x.subject === c.subject && x.grade === c.grade) : x.id === c.id;
            });
            var completed = (a.progress && a.progress.completedLessons) || [];
            dr.innerHTML = '<div class="tt-dh"><b>🗂️ شجرة المواضيع</b><button type="button" id="ttClose" aria-label="إغلاق">✕</button></div>' +
                '<div class="tt-wrap">' + renderTree(same, { currentCourseId: c.id, lessons: a.lessons, idx: a.currentLessonIndex, completed: completed }) + '</div>';
        }
    };
    window.CourseTree = CourseTree;

    document.addEventListener('DOMContentLoaded', function () {
        if (document.getElementById('coursesGrid')) initList();
    });
})();
