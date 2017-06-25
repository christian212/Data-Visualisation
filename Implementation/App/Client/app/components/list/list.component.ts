export interface ListComponent {
  data: any;
  count: number;
  
  add();
  details(id);
  delete(item);
}