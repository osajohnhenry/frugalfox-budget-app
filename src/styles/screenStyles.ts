import { StyleSheet } from 'react-native';
import { FONTS, TEXT_STYLES } from '../constants/fonts';

// Common styles that can be used across all screens
export const commonStyles = StyleSheet.create({
  // Icon styles
  unicodeIcon: { fontSize: 18, marginRight: 8 },
  unicodeIconLarge: { fontSize: 20, marginRight: 8 },
  unicodeIconSmall: { fontSize: 16, marginRight: 6 },
  
  // Color styles
  textPrimary: { color: '#333' },
  textSecondary: { color: '#555' },
  textMuted: { color: '#888' },
  textWhite: { color: '#fff' },
  
  // Income/Expense colors
  incomeColor: { color: '#2ecc71' },
  expenseColor: { color: '#e74c3c' },
  incomeBg: { backgroundColor: 'rgba(46, 204, 113, 0.25)' },
  expenseBg: { backgroundColor: 'rgba(231, 76, 60, 0.25)' },
  
  // Spacing
  marginSmall: { margin: 4 },
  marginMedium: { margin: 8 },
  marginLarge: { margin: 16 },
  marginRightSmall: { marginRight: 6 },
  marginRightMedium: { marginRight: 8 },
  marginRightLarge: { marginRight: 16 },
  
  // Flex layouts
  row: { flexDirection: 'row' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  column: { flexDirection: 'column' },
  center: { alignItems: 'center', justifyContent: 'center' },
  
  // Card styles
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  cardShadow: { elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  
  // Text styles
  textSmall: { ...TEXT_STYLES.small },
  textMedium: { ...TEXT_STYLES.base },
  textLarge: { ...TEXT_STYLES.large },
  textXLarge: { ...TEXT_STYLES.extraLarge },
  textXXLarge: { ...TEXT_STYLES.extraExtraLarge },
  bold: { ...TEXT_STYLES.baseBold },
  semiBold: { ...TEXT_STYLES.baseSemiBold },
  medium: { ...TEXT_STYLES.baseMedium },
  
  // Transaction summary card styles
  transactionSummaryCard: { 
    backgroundColor: '#d4edda', 
    padding: 16, 
    borderRadius: 12, 
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#28a745'
  },
  transactionSummaryCardExpense: { 
    backgroundColor: '#f8d7da', 
    borderLeftColor: '#dc3545'
  },
  transactionSummaryText: { 
    fontSize: 12, 
    color: '#155724', 
    marginBottom: 4 
  },
  transactionSummaryTextExpense: { 
    color: '#721c24' 
  },
  transactionSummaryAmount: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#155724' 
  },
  transactionSummaryAmountExpense: { 
    color: '#721c24' 
  },
  
  // Floating action button
  fab: {
    width: 56, 
    height: 56, 
    borderRadius: 28, 
    padding: 0, 
    justifyContent: 'center', 
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4
  },
  fabText: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 0 
  }
});

export const homeStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  balanceCard: { backgroundColor: '#4a90e2', padding: 20, borderRadius: 12, marginBottom: 20, alignItems: 'center' },
  balanceLabel: { ...TEXT_STYLES.large, color: '#fff', opacity: 0.9 },
  balanceValue: { ...TEXT_STYLES.massive, color: '#fff', marginTop: 8 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, width: '100%' },
  totalsBadge: { flex: 1, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 12, marginHorizontal: 4 },
  totalsLabel: { ...TEXT_STYLES.small, color: '#fff', marginBottom: 4, opacity: 0.9 },
  totalsValue: { ...TEXT_STYLES.largeSemiBold, color: '#fff' },
  expenseBadge: { backgroundColor: 'rgba(231, 76, 60, 0.25)' },
  incomeBadge: { backgroundColor: 'rgba(46, 204, 113, 0.25)' },
  list: { flexGrow: 1 },
  txItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, elevation: 2 },
  txItemContent: { flexDirection: 'row', justifyContent: 'space-between', flex: 1 },
  txCategory: { ...TEXT_STYLES.largeMedium },
  txDate: { ...TEXT_STYLES.small, color: '#888' },
  txAmount: { ...TEXT_STYLES.extraLargeBold },
  editIcon: { marginLeft: 12 },
  income: { color: '#2ecc71' },
  expense: { color: '#e74c3c' },
  emptyText: { ...TEXT_STYLES.large, textAlign: 'center', marginTop: 40, color: '#888' },
  headerButton: { padding: 8, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', marginRight: 12 },
  addButton: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  addButtonText: { ...TEXT_STYLES.extraLargeBold, color: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center' },
  transactionSection: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { ...TEXT_STYLES.extraLargeSemiBold, color: '#333' },
  viewAllLink: { ...TEXT_STYLES.baseSemiBold, color: '#4a90e2' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '90%', maxHeight: '80%' },
  modalTitle: { ...TEXT_STYLES.extraExtraLargeBold, marginBottom: 16, color: '#333' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  cancelBtn: { backgroundColor: '#ccc', padding: 12, borderRadius: 8, flex: 1, marginRight: 8, alignItems: 'center' },
  cancelBtnText: { ...TEXT_STYLES.largeSemiBold, color: '#333' },
  saveBtn: { backgroundColor: '#4a90e2', padding: 12, borderRadius: 8, flex: 1, marginLeft: 8, alignItems: 'center' },
  saveBtnText: { ...TEXT_STYLES.largeSemiBold, color: '#fff' },
  datePicker: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  dateIcon: { marginRight: 10 },
  dateText: { ...TEXT_STYLES.large, color: '#333' },
  amountContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  currencySymbol: { ...TEXT_STYLES.large, color: '#333', paddingLeft: 12, paddingRight: 8 },
  amountInput: { flex: 1, padding: 12, ...TEXT_STYLES.large },
  placeholderText: { color: '#999' },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
  dropdownText: { ...TEXT_STYLES.large, color: '#333' },
  dropdownArrow: { fontSize: 16, color: '#555' },
  dropdownList: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownItemRow: { flexDirection: 'row', alignItems: 'center' },
  dropdownItemText: { ...TEXT_STYLES.large, color: '#333' },
  dropdownItemIcon: { marginRight: 10 },
  emptyCategoryText: { ...TEXT_STYLES.base, color: '#888', padding: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12, ...TEXT_STYLES.large },
  textArea: { height: 80, textAlignVertical: 'top' },
  typeToggle: { flexDirection: 'row', marginBottom: 20, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd' },
  typeBtn: { flex: 1, padding: 12, alignItems: 'center' },
  typeText: { ...TEXT_STYLES.largeMedium },
  activeType: { backgroundColor: '#4a90e2' },
  activeTypeText: { ...TEXT_STYLES.largeMedium, color: '#fff' },
});

export const addTransactionStyles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  typeToggle: { flexDirection: 'row', marginBottom: 20, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd' },
  typeBtn: { flex: 1, padding: 12, alignItems: 'center' },
  typeText: { ...TEXT_STYLES.largeMedium },
  activeType: { backgroundColor: '#4a90e2' },
  activeTypeText: { ...TEXT_STYLES.largeMedium, color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12, ...TEXT_STYLES.large },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 },
  dropdownText: { ...TEXT_STYLES.large, color: '#333' },
  dropdownArrow: { fontSize: 16, color: '#555' },
  dropdownList: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownItemRow: { flexDirection: 'row', alignItems: 'center' },
  dropdownItemText: { ...TEXT_STYLES.large, color: '#333' },
  dropdownItemIcon: { marginRight: 10 },
  emptyCategoryText: { ...TEXT_STYLES.base, color: '#888', padding: 12 },
  manageButton: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#4a90e2', marginBottom: 12, alignItems: 'center' },
  manageButtonText: { ...TEXT_STYLES.largeSemiBold, color: '#4a90e2' },
  headerButton: { padding: 8, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', marginRight: 12 },
  textArea: { height: 80, textAlignVertical: 'top' },
  saveBtn: { backgroundColor: '#2ecc71', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  saveBtnText: { ...TEXT_STYLES.extraLargeBold, color: '#fff' },
  datePicker: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  dateIcon: { marginRight: 10 },
  dateText: { ...TEXT_STYLES.large, color: '#333' },
  amountContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  currencySymbol: { ...TEXT_STYLES.large, color: '#333', paddingLeft: 12, paddingRight: 8 },
  amountInput: { flex: 1, padding: 12, ...TEXT_STYLES.large },
  placeholderText: { color: '#999' },
  fullScreen: { flex: 1 },
});

export const categoriesStyles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#fff', padding: 20 },
  title: { ...TEXT_STYLES.huge, marginBottom: 16, color: '#333' },
  typeToggle: { flexDirection: 'row', marginBottom: 20, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd' },
  typeBtn: { flex: 1, padding: 12, alignItems: 'center' },
  typeText: { fontSize: 16, fontWeight: '500', color: '#333' },
  activeType: { backgroundColor: '#4a90e2' },
  activeTypeText: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 16 },
  addBtn: { backgroundColor: '#4a90e2', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  listSection: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10, color: '#333' },
  categoryItem: { padding: 12, borderRadius: 8, backgroundColor: '#f5f5f5', marginBottom: 8 },
  categoryItemRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, backgroundColor: '#f5f5f5', marginBottom: 8 },
  categoryIcon: { marginRight: 10 },
  categoryText: { fontSize: 16, color: '#333', flex: 1 },
  editBtn: { padding: 8 },
  deleteBtn: { marginLeft: 10, padding: 8 },
  emptyText: { color: '#888', fontSize: 14 },
  headerButton: { padding: 8, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', marginRight: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 12, width: '90%', maxHeight: '80%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  iconScroll: { maxHeight: 200 },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  iconOption: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center', margin: 5, borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  iconOptionSelected: { backgroundColor: '#4a90e2', borderColor: '#4a90e2' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  cancelBtn: { backgroundColor: '#ccc', padding: 12, borderRadius: 8, flex: 1, marginRight: 8, alignItems: 'center' },
  cancelBtnText: { color: '#333', fontSize: 16, fontWeight: '600' },
  saveBtn: { backgroundColor: '#4a90e2', padding: 12, borderRadius: 8, flex: 1, marginLeft: 8, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export const settingsStyles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  description: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24 },
});

export const chartsStyles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#333', textAlign: 'center' },
  headerButton: { padding: 8, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', marginRight: 12 },
  dateFilterContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 1 },
  dateButton: { padding: 8, borderRadius: 6, minWidth: 40, alignItems: 'center', justifyContent: 'center' },
  dateText: { fontSize: 16, fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 8, flex: 1 },
  cardTotal: { fontSize: 16, fontWeight: '600' },
  chartContainer: { justifyContent: 'center', alignItems: 'center', height: 200, marginBottom: 16, position: 'relative' },
  chartWithLegend: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  legendContainer: { marginLeft: 20, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  legendColor: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  legendText: { fontSize: 14, fontWeight: '600' },
  donutPlaceholder: { justifyContent: 'center', alignItems: 'center', width: 120, height: 120, borderRadius: 60, borderWidth: 8, borderColor: '#ddd' },
  donutText: { fontSize: 18, fontWeight: 'bold' },
  donutLabel: { fontSize: 12 },
  categoryList: { borderTopWidth: 1, paddingTop: 12 },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  categoryRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  categoryIcon: { marginRight: 8 },
  categoryName: { fontSize: 14, flex: 1 },
  categoryAmount: { fontSize: 14, fontWeight: '600' },
  emptyText: { textAlign: 'center', fontSize: 14, paddingVertical: 20 },
});

// Add/Edit Budget and Goal Screen Styles
export const budgetGoalStyles = StyleSheet.create({
  iconGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    justifyContent: 'center' as const,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  iconItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    margin: 8,
    borderWidth: 2,
  },
  iconItemText: {
    fontSize: 24,
  },
  selectedIconContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 16,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
  },
  selectedIconText: {
    fontSize: 32,
    marginRight: 12,
  },
  selectedIconLabel: {
    fontSize: 16,
    fontWeight: '500' as const,
  },
  saveButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 12,
  },
  inputField: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  amountContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 16,
  },
});

// Appearance Screen Styles
export const appearanceStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
  },
  settingRight: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  colorPreview: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '50%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
    borderWidth: 1,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  chevronIcon: {
  },
});

// Budget Screen Styles
export const budgetScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 64,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center' as const,
  },
  budgetIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  budgetAmount: {
    fontSize: 14,
  },
  actionButton: {
    padding: 4,
    marginLeft: 8,
  },
  spendingContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  spendingLabel: {
    fontSize: 12,
  },
  spendingAmount: {
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  remainingAmount: {
    fontSize: 14,
    fontWeight: 'bold' as const,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#eee',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%' as const,
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center' as const,
  },
  addBudgetButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addBudgetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
  headerButton: {
    padding: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 12,
  },
  recentTransactions: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 12,
  },
  recentTransactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  transactionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 12,
  },
  transactionDate: {
    fontSize: 12,
  },
});

// Categories Screen Styles
export const categoriesScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonIcon: {
    marginRight: 8,
  },
  typeButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  addBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  categoryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    flex: 1,
  },
  editBtn: {
    padding: 8,
  },
  deleteBtn: {
    marginLeft: 10,
    padding: 8,
  },
  emptyText: {
    fontSize: 14,
  },
  headerButton: {
    padding: 8,
  },
});

// Goal List Screen Styles
export const goalListStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  goalItem: {
    marginBottom: 12,
  },
  goalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  },
  goalIconText: {
    fontSize: 24,
    color: '#fff',
  },
  goalInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalName: {
    marginBottom: 4,
  },
  completedBadge: {
    fontSize: 12,
    marginLeft: 8,
  },
  goalMeta: {
    fontSize: 12,
  },
  goalActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  recentTransactions: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  recentTransactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  transactionIcon: {
    marginRight: 8,
  },
  transactionText: {
    flex: 1,
  },
  transactionAmount: {
    fontWeight: '600',
  },
  moreText: {
    textAlign: 'center',
    marginTop: 4,
  },
  addButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  createButton: {
    marginTop: 20,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginRight: 12,
  },
});

// Profile Screen Styles
export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  profileCard: {
    marginBottom: 16,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  },
  avatarIcon: {
    fontSize: 30,
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  nameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    borderBottomWidth: 1,
    marginRight: 8,
  },
  nameDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  editButton: {
    padding: 8,
  },
  saveButton: {
    marginRight: 8,
  },
  cancelButton: {
  },
  avatarHint: {
    fontSize: 14,
    marginTop: 4,
  },
});

// Settings Screen Styles
export const settingsScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 12,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    flex: 1,
  },
  chevronIcon: {
  },
});

// Export Chart Screen Styles
export const exportChartStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 15,
  },
  exportOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  exportOptionSelected: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  exportOptionContent: {
    flexDirection: 'row' as const,
    alignItems: 'flex-start',
  },
  exportOptionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  exportOptionText: {
    flex: 1,
  },
  exportOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exportOptionSubtitle: {
    fontSize: 13,
  },
  dateSelectionContainer: {
    marginBottom: 30,
  },
  dateButton: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  dateButtonIcon: {
    marginRight: 10,
  },
  dateButtonContent: {
    flex: 1,
  },
  dateButtonLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateButtonChevron: {
  },
  exportButton: {
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row' as const,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  exportButtonContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  exportButtonIcon: {
    marginRight: 10,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    borderLeftWidth: 4,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthOption: {
    width: '23%',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  monthOptionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  yearButton: {
    padding: 10,
    borderRadius: 8,
  },
  yearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 80,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

// Enhanced Transaction Screen Styles
export const transactionEnhancedStyles = StyleSheet.create({
  summaryCard: {
    borderLeftWidth: 4,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryHeader: {
    marginBottom: 8,
  },
  summaryType: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
  },
  summaryAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  summaryDetails: {
    marginTop: 8,
  },
  summaryCategory: {
    fontSize: 18,
    marginRight: 8,
  },
  summaryCategoryName: {
    fontSize: 16,
    fontWeight: '500',
  },
  summaryNote: {
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
  },
  formCard: {
    padding: 20,
    margin: 16,
    marginTop: -20,
    marginBottom: 32,
  },
  formHeader: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginTop: 16,
  },
  inputLabel: {
    marginBottom: 4,
  },
  enhancedInput: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  enhancedAmountContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  enhancedCurrencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 8,
  },
  enhancedAmountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
  },
  enhancedDropdown: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center' as const,
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
  },
  enhancedDropdownText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  enhancedDropdownList: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
  },
  enhancedDropdownItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderBottomWidth: 1,
  },
  enhancedTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  enhancedButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  enhancedButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
  },
  progressContainer: {
    marginTop: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  iconSelectionContainer: {
    marginTop: 16,
  },
  iconScroll: {
    marginHorizontal: -4,
  },
  iconOption: {
    width: 50,
    height: 50,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    margin: 5,
    borderRadius: 8,
    borderWidth: 2,
  },
  iconOptionText: {
    fontSize: 24,
  },
});
