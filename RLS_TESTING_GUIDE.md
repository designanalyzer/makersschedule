# 🔒 RLS Testing Guide
## Row Level Security Verification for Life Planner App

This guide helps you verify that Row Level Security (RLS) is working correctly and users can only access their own data.

---

## 🎯 What We're Testing

RLS ensures that:
- ✅ Users can only see their own data
- ✅ Users can only modify their own data
- ✅ Users cannot access other users' data
- ✅ No cross-user data leakage

---

## 🧪 Testing Methods

### Method 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to SQL Editor

2. **Run the RLS Test Script**
   - Copy the contents of `test-rls-policies.sql`
   - Paste into SQL Editor
   - Execute the script

3. **Verify Results**
   - Each query should only return data for the current user
   - Queries with `WHERE user_id != auth.uid()` should return empty

### Method 2: Manual Testing with Multiple Users

1. **Create Test Users**
   ```sql
   -- Check existing users
   SELECT id, email FROM auth.users LIMIT 5;
   ```

2. **Test Each Table**
   - Switch between different user sessions
   - Verify each user only sees their own data

---

## 📋 Test Checklist

### ✅ User Preferences Table
- [ ] User can see their own preferences
- [ ] User cannot see other users' preferences
- [ ] User can update their own preferences
- [ ] User cannot update other users' preferences

### ✅ Goals Table
- [ ] User can see their own goals
- [ ] User cannot see other users' goals
- [ ] User can create goals for themselves
- [ ] User cannot create goals for other users

### ✅ Goal Steps Table
- [ ] User can see steps for their own goals
- [ ] User cannot see steps for other users' goals
- [ ] User can modify steps for their own goals
- [ ] User cannot modify steps for other users' goals

### ✅ Notes Table
- [ ] User can see their own notes
- [ ] User cannot see other users' notes
- [ ] User can create/update their own notes
- [ ] User cannot create/update other users' notes

### ✅ Tasks Table
- [ ] User can see their own tasks
- [ ] User cannot see other users' tasks
- [ ] User can create/update their own tasks
- [ ] User cannot create/update other users' tasks

### ✅ Unscheduled Tasks Table
- [ ] User can see their own unscheduled tasks
- [ ] User cannot see other users' unscheduled tasks
- [ ] User can create/update their own unscheduled tasks
- [ ] User cannot create/update other users' unscheduled tasks

### ✅ Users Table
- [ ] User can see their own profile
- [ ] User cannot see other users' profiles
- [ ] User can update their own profile
- [ ] User cannot update other users' profiles

---

## 🔍 Verification Queries

### Check RLS Status
```sql
-- Verify RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('users', 'goals', 'goal_steps', 'notes', 'tasks', 'unscheduled_tasks', 'user_preferences')
ORDER BY tablename;
```

### Check RLS Policies
```sql
-- Verify all tables have appropriate policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE schemaname = 'public'
  AND tablename IN ('users', 'goals', 'goal_steps', 'notes', 'tasks', 'unscheduled_tasks', 'user_preferences')
ORDER BY tablename, policyname;
```

---

## 🚨 Expected Results

### ✅ Success Indicators
- All tables show `rowsecurity = true`
- Each table has policies for SELECT, INSERT, UPDATE, DELETE
- Queries only return current user's data
- Cross-user queries return empty results

### ❌ Failure Indicators
- Tables show `rowsecurity = false`
- Missing policies for any CRUD operations
- Users can see other users' data
- Cross-user queries return data

---

## 🛠️ Troubleshooting

### Issue: Users can see other users' data
**Solution:**
1. Check if RLS is enabled: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. Verify policies exist: Check `pg_policies` table
3. Ensure policies use correct user ID comparison

### Issue: Users cannot access their own data
**Solution:**
1. Check policy syntax for typos
2. Verify `auth.uid()` is working correctly
3. Ensure user is properly authenticated

### Issue: Policies not working
**Solution:**
1. Drop and recreate policies
2. Check for conflicting policies
3. Verify table structure matches policy expectations

---

## 📊 Sample Test Data

### Create Test Data (if needed)
```sql
-- Insert test goals for current user
INSERT INTO goals (user_id, title, description, category, deadline, timeline, effort)
VALUES 
  (auth.uid()::text, 'Test Goal 1', 'Test description', 'work', '2024-12-31', 3, 10),
  (auth.uid()::text, 'Test Goal 2', 'Test description', 'personal', '2024-12-31', 6, 5);

-- Insert test notes for current user
INSERT INTO notes (user_id, content)
VALUES 
  (auth.uid()::text, 'Test note 1'),
  (auth.uid()::text, 'Test note 2');
```

---

## 🎯 Testing Best Practices

1. **Test with Multiple Users**
   - Create at least 2 test accounts
   - Verify complete data isolation

2. **Test All CRUD Operations**
   - SELECT (read)
   - INSERT (create)
   - UPDATE (modify)
   - DELETE (remove)

3. **Test Edge Cases**
   - Empty results
   - Invalid user IDs
   - Unauthenticated access

4. **Document Results**
   - Keep a testing log
   - Note any issues found
   - Document fixes applied

---

## 🔒 Security Verification

After testing, verify:
- [ ] No user can access another user's data
- [ ] All tables have RLS enabled
- [ ] All CRUD operations are protected
- [ ] Policies use secure user ID comparison
- [ ] No SQL injection vulnerabilities
- [ ] Proper error handling without data leakage

---

## 📞 Support

If you encounter issues:
1. Check the Supabase logs
2. Verify your RLS policies syntax
3. Test with the provided SQL script
4. Review the troubleshooting section above

**Remember:** RLS is your primary defense for multi-user data isolation. Always test thoroughly before production deployment! 