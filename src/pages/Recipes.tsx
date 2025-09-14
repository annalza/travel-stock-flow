import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, ChefHat, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ingredient {
  item: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  servings: number;
  category: string;
}

const Recipes = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState({ item: '', quantity: 0, unit: '' });

  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      name: 'Pasta Marinara',
      description: 'Classic Italian pasta with tomato sauce',
      ingredients: [
        { item: 'Tomatoes', quantity: 2, unit: 'kg' },
        { item: 'Olive Oil', quantity: 0.1, unit: 'liters' },
        { item: 'Pasta', quantity: 1, unit: 'kg' }
      ],
      servings: 10,
      category: 'Main Course'
    },
    {
      id: '2',
      name: 'Grilled Chicken',
      description: 'Herb-seasoned grilled chicken breast',
      ingredients: [
        { item: 'Chicken Breast', quantity: 2, unit: 'kg' },
        { item: 'Olive Oil', quantity: 0.05, unit: 'liters' }
      ],
      servings: 8,
      category: 'Main Course'
    }
  ]);

  const [newRecipe, setNewRecipe] = useState<{
    name: string;
    description: string;
    ingredients: Ingredient[];
    servings: number;
    category: string;
  }>({
    name: '',
    description: '',
    ingredients: [],
    servings: 1,
    category: ''
  });

  const handleAddIngredient = () => {
    if (!currentIngredient.item || !currentIngredient.quantity || !currentIngredient.unit) {
      toast({
        title: "Error",
        description: "Please fill in all ingredient fields.",
        variant: "destructive"
      });
      return;
    }

    setNewRecipe({
      ...newRecipe,
      ingredients: [...newRecipe.ingredients, currentIngredient]
    });
    
    setCurrentIngredient({ item: '', quantity: 0, unit: '' });
  };

  const handleRemoveIngredient = (index: number) => {
    setNewRecipe({
      ...newRecipe,
      ingredients: newRecipe.ingredients.filter((_, i) => i !== index)
    });
  };

  const handleAddRecipe = () => {
    if (!newRecipe.name || !newRecipe.category || newRecipe.ingredients.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one ingredient.",
        variant: "destructive"
      });
      return;
    }

    const recipe: Recipe = {
      id: Date.now().toString(),
      ...newRecipe
    };

    setRecipes([...recipes, recipe]);
    setNewRecipe({
      name: '',
      description: '',
      ingredients: [],
      servings: 1,
      category: ''
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Recipe added successfully."
    });
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
    toast({
      title: "Success",
      description: "Recipe deleted successfully."
    });
  };

  const handleSellRecipe = (recipeId: string, quantity: number = 1) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    // In a real app, this would update the inventory by reducing ingredients
    // For now, we'll just show a toast
    const ingredientsList = recipe.ingredients
      .map(ing => `${ing.quantity * quantity} ${ing.unit} of ${ing.item}`)
      .join(', ');

    toast({
      title: "Recipe Sold",
      description: `Ingredients reduced: ${ingredientsList}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recipe Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage recipes and track ingredient usage
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Recipe
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Recipe</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Recipe Name</Label>
                  <Input
                    id="name"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                    placeholder="Enter recipe name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newRecipe.category}
                    onChange={(e) => setNewRecipe({ ...newRecipe, category: e.target.value })}
                    placeholder="Main Course, Appetizer, etc."
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newRecipe.description}
                  onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                  placeholder="Enter recipe description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  value={newRecipe.servings}
                  onChange={(e) => setNewRecipe({ ...newRecipe, servings: parseInt(e.target.value) || 1 })}
                  placeholder="Number of servings"
                />
              </div>

              <div>
                <Label>Ingredients</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <Input
                    placeholder="Ingredient"
                    value={currentIngredient.item}
                    onChange={(e) => setCurrentIngredient({ ...currentIngredient, item: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={currentIngredient.quantity}
                    onChange={(e) => setCurrentIngredient({ ...currentIngredient, quantity: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    placeholder="Unit"
                    value={currentIngredient.unit}
                    onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e.target.value })}
                  />
                  <Button onClick={handleAddIngredient} size="sm">
                    Add
                  </Button>
                </div>

                {newRecipe.ingredients.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label>Added Ingredients:</Label>
                    {newRecipe.ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-accent rounded">
                        <span className="text-sm">
                          {ingredient.quantity} {ingredient.unit} of {ingredient.item}
                        </span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemoveIngredient(index)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={handleAddRecipe} className="w-full">
                Add Recipe
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChefHat className="h-5 w-5 mr-2" />
            Recipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Recipe Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Servings</TableHead>
                <TableHead>Ingredients</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipes.map((recipe) => (
                <TableRow key={recipe.id}>
                  <TableCell className="font-medium">{recipe.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{recipe.name}</div>
                      <div className="text-sm text-muted-foreground">{recipe.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{recipe.category}</TableCell>
                  <TableCell>{recipe.servings}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {recipe.ingredients.map((ing, index) => (
                        <div key={index}>
                          {ing.quantity} {ing.unit} {ing.item}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleSellRecipe(recipe.id)}
                      >
                        Sell 1
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteRecipe(recipe.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Recipes;