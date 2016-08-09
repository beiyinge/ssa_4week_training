import java.util.Vector;

public class Stack {
	private int[] intArrayStore = new int[0];

	private int length=0;
	public static void main(String[] args) {
		// TODO Auto-generated method stub
       Stack st = new Stack();
       
       try {
    	   
	       
	       for (int i=0; i< 50; i++){
	    	   System.out.println("push "+i + " length="+st.getLength() );
	    	   st.push(i);
	       }
       } catch (Exception e) {
    	   e.printStackTrace();
       }
       
    try {
       for (int j=0; j< 50; j++){
       System.out.println ("pop, " + st.pop());
       }
       
	 } catch (Exception e) {
  	   e.printStackTrace();
     }
	}
 
	//last in, first out
	public Stack (){
		intArrayStore = new int[0];
		length =0;
		//intArrayStore = new int [10];
	}
	
	public int pop ( ) throws Exception {
		
		int val = intArrayStore [length-1];
		this.length -= 1;
		//reduce the array
		int[] tmpArray = new int[this.length];
		
		for (int i=0; i< this.length; i++){
			
			tmpArray[i] = intArrayStore[i];
		}
		
		intArrayStore = tmpArray;
		
		
		return val;
		
		
	}
	
	public void push (int val) throws Exception {
		
		//increase the array
		int[] tmpArray = new int[this.length+1];
		
		for (int i=0; i< this.length; i++){
			
			tmpArray[i] = intArrayStore[i];
		}
		tmpArray [this.length] = val;
		
		this.intArrayStore = tmpArray;
		this.length ++;
	}
	
	public int getLength (){
		return this.length;
	}
	
}
