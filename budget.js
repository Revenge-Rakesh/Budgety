//keeps the track of all the income and expenses 
var budgetController = (function(){
   
    //function constructor to create more objects
  var Expense = function(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
  };
    
    //methode for percentages
     Expense.prototype.calcPercentage = function(totalIncome){
         if (totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100);
         }else {
             this.percentage = -1;
         }   
    };
    // retrive the percentage from tge object
    Expense.prototype.getPercentage = function(){
      return this.percentage;  
    };
    
    var Income = function(id, description, value){
      this.id = id;
      this.description = description;
      this.value = value;
  };  
    
    //function for summing the income and expenses
    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum = sum + cur.value;
        });
        data.totals[type] = sum;
    };
    
   //store the data
    var data = {
         allItems:{
             exp: [],
             inc: []
         },
        totals:{
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };
    
    //adding new item to allow the public use
    return{
        addItem: function(type,des,val){
         var newItem, id;
            
            //create new id
            if (data.allItems[type].length > 0){
            id = data.allItems[type][data.allItems[type].length-1].id + 1;
                }else{
                    id = 0;
                }
            
            //create  new item either inc or exp
            if(type === 'exp'){
                 newItem = new Expense(id,des,val);
            }else if(type === 'inc'){
                 newItem = new Income(id,des,val);
            }
            //pushing the data 
           data.allItems[type].push(newItem);
            return newItem;
           
        },
        
        //method for delete the item
        deleteItem: function(type, id){
            var ids, index;
            //looping the elements (another method called map)
           ids = data.allItems[type].map(function(current){
              
              return current.id; 
           });
            //receving the index of id to be deleted
            index = ids.indexOf(id);
            if (index !== -1){
                //another method to delete the item calles splice
                data.allItems[type].splice(index, 1);
            }
        },
        
        //method for caluculate budget 
        calculateBudget: function(){
            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            //calculate the budget income-expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            
            //calculate the percentage of expenses
            if(data.totals.inc > 0){
            data.percentage = Math.round( (data.totals.exp / data.totals.inc )* 100);
                }else{
                  data.percentage = -1;  
                }
               
        },
        
        //method for calculate percentage in budget
        calculatePercentages: function(){
          
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });    
        },
         
        getPercentage: function(){
      var allPerc = data.allItems.exp.map(function(cur){
         return cur.getPercentage();
    }); 
     return allPerc;
    },
          
        
        //method for geting or return budget
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };  //this will return the all above as object forms
        },
        
        //for testing 
        testing: function(){
            console.log(data);
        }
    };
})();

var UIController = (function(){
    var DOMstrings = {
        inputType:'.add-type',
        inputDescription:'.add-description',
        inputValue:'.add-value',
        inputBtn:'.add-btn',
        incomeContainer:'.income-list',
        expensesContainer:'.expanse-list',
        budgetLabel:'.budget-value',
        incomeLabel:'.budget-income-value',
        expenseLabel:'.budget-expanse-value',
        percentageLabel:'.budget-expanse-percentage',
        container:'.container',
        expensesPercentageLabel: '.item-percentage',
        dateLabel:'.title-month'
        
    };
    

    //method for formating thge number positive or negative and thousand or hundereds
       
     var  formatNumber = function(num, type){
           var  numSplit, int, dec,type;
           num = Math.abs(num);
           num = num.toFixed(2); //put the two decimal numbers
           
           //spliting the integer and decimal points
           numSplit = num.split('.');
           int = numSplit[0];
           if(int.length > 3){
               
               int = int.substr(0, int.length-3) + ',' + int.substr(int.lenth-3, 3);
           }
           dec = numSplit[1];
           
           if(type === 'exp'){
               sign = '-';
           }else{
               sign = '+';
           }
            
        return sign + ' ' + int + '.' + dec;       
           
       };
       
       
   return{
       getInput: function(){
           
           return{
                type: document.querySelector(DOMstrings.inputType).value,
           description: document.querySelector(DOMstrings.inputDescription).value,
           //value: document.querySelector(DOMstrings.inputValue).value
               //this will give the value as string
               
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
           };     
       },
       
       //adding item to user interface 
       addListItem: function(obj, type){
           var html, newHtml, element;
           
           //creating html string
           if (type === 'inc'){
              element = DOMstrings.incomeContainer;  
        html = '<div class="item" id="inc-%id%"><div class="item-discription">%description%</div><div class="right-clearfix"><div class="item-value">%value%</div><div class="item-delete"><button class="item-delete-button"><i class="fa fa-close"></i></button></div></div> </div>'
           }else if (type === 'exp'){
               element = DOMstrings.expensesContainer;
        html = '<div class="item" id="exp-%id%"><div class="item-discription">%description%</div><div class="left-clearfix"><div class="item-value">%value%</div><div class="item-percentage">21%</div><div class="item-delete"><button class="item-delete-button"><i class="fa fa-close"></i></button></div></div> </div>'
           }
           
           //repalcing data 
          newHtml = html.replace('%id%',obj.id);
           newHtml = newHtml.replace('%description%', obj.description);
           newHtml = newHtml.replace('%value%', formatNumber(obj.value,type));
    
           //insert html into DOM one by one at the end 
          document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);    
       },
       
       //method for delete the item from user interface
       deleteListItem: function(selectorID){
         var el = document.getElementById(selectorID);
         el.parentNode.removeChild(el);
           
       },
       
       
       //method for
       //clear input fields after entering
       clearFields: function(){
         var fields, fieldsArr
           fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); 
           
           //store the input data into array
            fieldsArr = Array.prototype.slice.call(fields);
           //clear 
           fieldsArr.forEach(function(current, index, array){
               current.value = "";
           });
           
           fieldsArr[0].focus();   
       },
       
       //method for displaying the budget 
       displayBudget: function(obj){
           var type;
           if(obj.budget > 0){
               type = 'inc';
           }else{
               type = 'exp';
           }
           document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type); 
           document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
           document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
           
           if(obj.percentage > 0){
               document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
           }else{
               document.querySelector(DOMstrings.percentageLabel).textContent = '---';
           }
           
       },
       
       //display the percentage at user interface
       displayPercentages: function(percentages){
         
         var fields = document.querySelectorAll(DOMstrings.expensesPercentageLabel); 
         var nodeListForEach = function(list,callback){
           for(var i = 0; i<list.length; i++){
               callback(list[i],i);
           }    
         }; 
            
          nodeListForEach(fields, function(current, index){
              if(percentages[index] > 0){
             current.textContent = percentages[index] + '%'; 
                  }else {
                      current.textContent = '----';
                  }
          }) ;   
           
       },
       
       //method for displaying the month of budget to be calculated
       displayMonth: function(){
         var now, year, month, months;
           now = new Date();
           year = now.getFullYear();
           
           months = ['January', 'Februray', 'March', 'April', 'May', 'June', 'July','August', 'September', 'October', 'November', 'December'];
           month = now.getMonth();
           
           
           document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
           
        
       },
       
       //method for  providing data to the public functions
       getDomstrings: function(){
           return DOMstrings;
       }
   }; 
    
})();


var controller = (function(budgetCtrl, UIctrl){
    
    var setupEventListeners = function(){
       
        // accessing the public data into private
    var DOM = UIctrl.getDomstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(event){
        if(event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }  
    });
      //event handler for deletion  
    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
     
        
    };
    
    
    
    
    //function for caluculating the budgets
    var updateBudget = function(){
      
         //1.calculate budget
        budgetCtrl.calculateBudget();
        
        //return the value
        var budget = budgetCtrl.getBudget();
    //2.display the budget on UI
      UIctrl.displayBudget(budget);
        
    };
    
    //function for udating the percentage of expenses
    var updatePercentages = function(){
        //1.calculate the percentages
        budgetCtrl.calculatePercentages();
        
        
        //2.read the percentages from the budget controller
        var percentages = budgetCtrl.getPercentage();
        
        //3.update the user interface
        UIctrl.displayPercentages(percentages);
        
        
    };
                        
    
    var ctrlAddItem = function(){
    
    //1.input data
      var input = UIctrl.getInput();  
     
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
    //2.add to budget controller
      var newItem = budgetCtrl.addItem(input.type, input.description, input.value); 
    //3.add to UI
        UIctrl.addListItem(newItem,input.type);
        
        //clear the input data 
        UIctrl.clearFields();
        
     //4.caluculate budget 
        updateBudget();
            
        //calculate tthe percentage and upadte
          updatePercentages();  
        
      }
    };
    
    //delete function for deletion of item
    var ctrlDeleteItem = function(event){
        var itemId, type, splitId, Id;
        itemId =event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId){
            
            //spliting the id in two parts 
            splitId = itemId.split('-');
            type = splitId[0];
            //this will give the string as spliteed
            //Id = splitId[1];
            Id = parseInt(splitId[1]);
            //1.delete the item from data
            budgetCtrl.deleteItem(type, Id);
            
            //2.delete the item from user interface
            UIctrl.deleteListItem(itemId);
            
            //3.update the new budget
            updateBudget();
            
            //calculate and update percentages
            updatePercentages();
        }
    
        
    };
    return{
        init:function(){
            
            console.log('started.');
            //display the month
            UIctrl.displayMonth();
             //to make after reload all the values are zeros
            UIctrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
    
    
})(budgetController, UIController);

controller.init();



