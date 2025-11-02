# Budget Allocation Guide for Admins

## 🎯 How to Allocate Budget to Clubs

### Step-by-Step Process:

### 1. **Login as Admin**
- Email: `admin@iiitkalyani.ac.in`
- Password: `admin@123`

### 2. **Navigate to Budget Page**
- Click on "Budget" in the admin dashboard sidebar
- Or go directly to: `/admin/budget`

### 3. **Allocate Budget to a Club**

#### Method 1: Allocate to New Club
1. Click the **"Allocate Budget to Club"** button at the top of the page
2. A form will appear with two fields:
   - **Select Club**: Choose a club from the dropdown
   - **Budget Amount**: Enter the amount in rupees (₹)
3. Click **"Allocate Budget"**
4. You'll see a success message
5. The budget will appear in the list below

#### Method 2: Update Existing Budget
1. Find the club card in the budget list
2. Click the **"Update Budget"** button on the right
3. The allocation form will open with current values
4. Modify the budget amount
5. Click **"Allocate Budget"** to update

### 4. **View Budget Details**
- Each club card shows:
  - Allocated amount
  - Total spent
  - Remaining balance
  - Utilization percentage with color-coded progress bar
  - Click **"View Expenses"** to see detailed expense history

---

## 💰 Budget Features

### **For Admins:**

#### Dashboard Statistics:
- **Total Allocated**: Sum of all budgets across clubs
- **Total Expenses**: Total amount spent by all clubs
- **Total Remaining**: Available balance across all clubs

#### Per-Club View:
- Allocated amount
- Spent amount with red indicator
- Remaining balance with green indicator
- Progress bar:
  - 🟢 Green: <70% used (healthy)
  - 🟡 Yellow: 70-90% used (warning)
  - 🔴 Red: >90% used (critical)

#### Expense Tracking:
- View all expenses for each club
- See expense description, date, and amount
- Expenses are added by club coordinators

### **For Coordinators:**

Coordinators can:
1. View their club's allocated budget
2. Add expenses with description and amount
3. Track spending and remaining balance
4. View expense history

---

## 📋 Budget Allocation Examples

### Example 1: Allocate to Debating Society
```
Club: Debating Society
Amount: ₹50,000
```
Result: Debating Society gets ₹50,000 budget

### Example 2: Allocate to Music Club
```
Club: Music Club
Amount: ₹75,000
```
Result: Music Club gets ₹75,000 budget

### Example 3: Update Existing Budget
```
Club: Drama Club (current: ₹40,000)
New Amount: ₹60,000
```
Result: Drama Club budget updated to ₹60,000

---

## 🔄 Budget Workflow

```
Admin Allocates Budget
         ↓
Coordinator Views Budget
         ↓
Coordinator Adds Expenses
         ↓
Admin Views Updated Budget & Expenses
         ↓
Admin Can Update/Reallocate Budget
```

---

## 💡 Best Practices

### For Admins:

1. **Allocate Based on Club Size**
   - Larger clubs with more activities need bigger budgets
   - Consider past performance and upcoming events

2. **Monitor Utilization**
   - Check progress bars regularly
   - Yellow/Red indicators mean club is running low
   - Consider budget reallocation if needed

3. **Review Expenses**
   - Click "View Expenses" to see how money is spent
   - Verify expenses are legitimate
   - Track spending patterns

4. **Update Budgets**
   - Use "Update Budget" to increase/decrease allocations
   - Adjustments can be made anytime
   - Previous expenses are retained

### For Coordinators:

1. **Track Spending**
   - Add expenses immediately after purchase
   - Use clear descriptions
   - Monitor remaining balance

2. **Plan Ahead**
   - Check budget before planning events
   - Ensure sufficient funds are available
   - Request budget increase if needed

3. **Be Transparent**
   - Document all expenses properly
   - Include detailed descriptions
   - Keep receipts for verification

---

## 📊 Budget Allocation Tips

### Recommended Budget Ranges:

- **Small Clubs** (10-20 members): ₹20,000 - ₹40,000
- **Medium Clubs** (20-50 members): ₹40,000 - ₹80,000
- **Large Clubs** (50+ members): ₹80,000 - ₹150,000

### Factors to Consider:

1. **Number of Members**
   - More members = more activities = higher budget

2. **Event Frequency**
   - Clubs hosting frequent events need more funds
   - Consider annual event calendar

3. **Equipment Needs**
   - Technical clubs may need equipment purchases
   - Sports clubs need sports gear

4. **Past Performance**
   - Review previous year's expenses
   - Allocate based on historical data

5. **Strategic Importance**
   - Flagship clubs may receive higher allocation
   - Consider institutional priorities

---

## 🛠️ API Endpoints Used

### Admin Budget Operations:
- `GET /api/budgets` - Fetch all budgets
- `POST /api/budgets` - Allocate/Update budget
  ```json
  {
    "clubId": "club_id_here",
    "allocatedAmount": 50000
  }
  ```

### Coordinator Operations:
- `POST /api/budgets/[clubId]/expenses` - Add expense
  ```json
  {
    "description": "Event supplies",
    "amount": 5000
  }
  ```

---

## ❓ FAQs

### Q1: Can I allocate budget to the same club multiple times?
**A:** Yes! If a club already has a budget, using the allocation form will UPDATE the existing budget, not create a duplicate.

### Q2: What happens to expenses when I update budget?
**A:** All existing expenses are preserved. Only the allocated amount changes.

### Q3: Can coordinators see other clubs' budgets?
**A:** No, coordinators can only see their own club's budget.

### Q4: Can I remove a budget allocation?
**A:** Currently, you can set it to ₹0 or update it to any amount. Future updates may add a delete option.

### Q5: How do I know which clubs need budget?
**A:** The allocation form shows "(Budget already allocated)" next to clubs that have budgets. It also displays the count of clubs without budget allocation.

### Q6: Can coordinators allocate budgets?
**A:** No, only admins can allocate budgets. Coordinators can only add expenses.

### Q7: Is there a limit on budget amount?
**A:** No specific limit, but ensure it's realistic and within institutional budget.

### Q8: Can I see budget history?
**A:** Currently shows current state. Future updates may add audit logs showing budget changes over time.

---

## 🎨 UI Elements Explained

### Colors:
- **Blue**: Budget allocated amount
- **Red**: Money spent (expenses)
- **Green**: Money remaining (available)

### Progress Bar Colors:
- **Green** (<70%): Club has plenty of budget left
- **Yellow** (70-90%): Club should be cautious
- **Red** (>90%): Club is almost out of budget

### Buttons:
- **"Allocate Budget to Club"**: Opens form to allocate new budget
- **"Update Budget"**: Opens form to modify existing budget
- **"View Expenses"**: Shows/hides expense list
- **"Hide Expenses"**: Collapses expense list

---

## 🚀 Quick Start Example

**Scenario:** You want to allocate ₹60,000 to Photography Club

1. Go to `/admin/budget`
2. Click "Allocate Budget to Club"
3. Select "Photography Club" from dropdown
4. Enter "60000" in amount field
5. Click "Allocate Budget"
6. Done! Photography Club now has ₹60,000

**Later Update:**
1. Find Photography Club card
2. Click "Update Budget"
3. Change amount to "80000"
4. Click "Allocate Budget"
5. Budget updated to ₹80,000!

---

## ✅ Success Checklist

Before allocating budgets:
- [ ] All clubs are created
- [ ] Coordinators are assigned to clubs
- [ ] You've determined budget amounts
- [ ] You're logged in as admin

After allocating budgets:
- [ ] Each club shows budget in the list
- [ ] Progress bars are visible
- [ ] Coordinators can view their budgets
- [ ] Expense tracking is working

---

**The budget system is now fully functional and ready for use!** 🎉
